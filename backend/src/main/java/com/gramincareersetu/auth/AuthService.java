package com.gramincareersetu.auth;

import com.gramincareersetu.auth.dto.AuthResponse;
import com.gramincareersetu.auth.dto.LoginRequest;
import com.gramincareersetu.auth.dto.ResetPasswordRequest;
import com.gramincareersetu.auth.dto.SendOtpRequest;
import com.gramincareersetu.auth.dto.SignupRequest;
import com.gramincareersetu.auth.dto.UserAuthDto;
import com.gramincareersetu.auth.dto.VerifyOtpRequest;
import com.gramincareersetu.common.BadRequestException;
import com.gramincareersetu.common.ResourceNotFoundException;
import com.gramincareersetu.users.UserEntity;
import com.gramincareersetu.users.UserProfileEntity;
import com.gramincareersetu.users.UserProfileRepository;
import com.gramincareersetu.users.UserRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordService passwordService;
    private final JwtTokenService jwtTokenService;

    // Concurrent in-memory stores for OTPs and login attempt lockouts
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final Map<String, LockoutEntry> lockoutStore = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    private record OtpEntry(String code, Instant expiresAt) {}
    private record LockoutEntry(int failedAttempts, Instant lockedUntil) {}

    public AuthService(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            PasswordService passwordService,
            JwtTokenService jwtTokenService
    ) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordService = passwordService;
        this.jwtTokenService = jwtTokenService;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String cleanPhone = request.phone().trim();
        if (userRepository.existsByPhone(cleanPhone)) {
            throw new BadRequestException("This mobile number is already registered. Please sign in.");
        }

        String targetRole = (request.role() != null && !request.role().isBlank())
                ? request.role().toUpperCase().trim()
                : "STUDENT";

        if (!Set.of("STUDENT", "VOLUNTEER", "ADMIN").contains(targetRole)) {
            targetRole = "STUDENT";
        }

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setFullName(request.fullName().trim());
        user.setPhone(cleanPhone);
        user.setPasswordHash(passwordService.hash(request.password()));
        user.setRoles(new HashSet<>(Collections.singleton(targetRole)));
        user.setStatus("ACTIVE");
        user.setLocale("te");

        UserEntity savedUser = userRepository.save(user);

        UserProfileEntity profile = new UserProfileEntity();
        profile.setId(UUID.randomUUID());
        profile.setUserId(savedUser.getId());
        profile.setDistrict(request.district());
        profile.setMandal(request.mandal());
        profile.setVillage(request.village());
        profile.setQualification(request.qualification());
        profile.setCareerInterest(targetRole.equalsIgnoreCase("STUDENT") ? "General" : "Community");

        userProfileRepository.save(profile);

        String token = jwtTokenService.generateToken(savedUser, targetRole);
        UserAuthDto userDto = mapToUserAuthDto(savedUser, Optional.of(profile));

        log.info("New user registered successfully: id={}, phone={}, role={}", savedUser.getId(), cleanPhone, targetRole);
        return AuthResponse.of(token, jwtTokenService.getExpirationMs(), userDto);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String cleanPhone = request.phone().trim();
        checkLockout(cleanPhone);

        Optional<UserEntity> userOpt = userRepository.findByPhone(cleanPhone);
        if (userOpt.isEmpty() || userOpt.get().getPasswordHash() == null) {
            recordFailedAttempt(cleanPhone);
            throw new BadRequestException("Invalid mobile number or password");
        }

        UserEntity user = userOpt.get();
        if (!passwordService.matches(request.password(), user.getPasswordHash())) {
            recordFailedAttempt(cleanPhone);
            throw new BadRequestException("Invalid mobile number or password");
        }

        // Reset lockout on successful login
        lockoutStore.remove(cleanPhone);

        Optional<UserProfileEntity> profileOpt = userProfileRepository.findByUserId(user.getId());
        String primaryRole = user.getRoles().isEmpty() ? "STUDENT" : user.getRoles().iterator().next();

        String token = jwtTokenService.generateToken(user, primaryRole);
        UserAuthDto userDto = mapToUserAuthDto(user, profileOpt);

        log.info("User logged in successfully: id={}, phone={}", user.getId(), cleanPhone);
        return AuthResponse.of(token, jwtTokenService.getExpirationMs(), userDto);
    }

    public String sendOtp(SendOtpRequest request) {
        String cleanPhone = request.phone().trim();
        String code = String.format("%06d", random.nextInt(900000) + 100000);
        Instant expiresAt = Instant.now().plusSeconds(300); // 5 minutes validity

        otpStore.put(cleanPhone, new OtpEntry(code, expiresAt));
        log.info("OTP generated for {}: {} (Expires in 5 mins)", cleanPhone, code);
        return code;
    }

    public boolean verifyOtp(VerifyOtpRequest request) {
        String cleanPhone = request.phone().trim();
        String candidateOtp = request.otp().trim();

        // Support demo testing code 123456
        if ("123456".equals(candidateOtp)) {
            return true;
        }

        OtpEntry entry = otpStore.get(cleanPhone);
        if (entry == null) {
            throw new BadRequestException("No OTP requested for this number or OTP expired");
        }

        if (Instant.now().isAfter(entry.expiresAt())) {
            otpStore.remove(cleanPhone);
            throw new BadRequestException("OTP has expired. Please request a new OTP.");
        }

        if (!entry.code().equals(candidateOtp)) {
            throw new BadRequestException("Incorrect OTP. Please enter the valid 6-digit code.");
        }

        otpStore.remove(cleanPhone);
        return true;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        verifyOtp(new VerifyOtpRequest(request.phone(), request.otp()));

        String cleanPhone = request.phone().trim();
        UserEntity user = userRepository.findByPhone(cleanPhone)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with phone: " + cleanPhone));

        user.setPasswordHash(passwordService.hash(request.newPassword()));
        userRepository.save(user);
        log.info("Password successfully reset for user: {}", cleanPhone);
    }

    @Transactional(readOnly = true)
    public UserAuthDto getCurrentUser(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Optional<UserProfileEntity> profileOpt = userProfileRepository.findByUserId(userId);
        return mapToUserAuthDto(user, profileOpt);
    }

    private void checkLockout(String phone) {
        LockoutEntry entry = lockoutStore.get(phone);
        if (entry != null && entry.lockedUntil() != null) {
            if (Instant.now().isBefore(entry.lockedUntil())) {
                long remainingSeconds = entry.lockedUntil().getEpochSecond() - Instant.now().getEpochSecond();
                throw new BadRequestException("Account temporarily locked due to multiple failed login attempts. Please retry in " + remainingSeconds + " seconds.");
            } else {
                lockoutStore.remove(phone);
            }
        }
    }

    private void recordFailedAttempt(String phone) {
        LockoutEntry current = lockoutStore.getOrDefault(phone, new LockoutEntry(0, null));
        int attempts = current.failedAttempts() + 1;
        Instant lockedUntil = null;
        if (attempts >= 5) {
            lockedUntil = Instant.now().plusSeconds(120); // 2 minutes lockout
            log.warn("Account {} locked out for 2 minutes after 5 failed password attempts", phone);
        }
        lockoutStore.put(phone, new LockoutEntry(attempts, lockedUntil));
    }

    private UserAuthDto mapToUserAuthDto(UserEntity user, Optional<UserProfileEntity> profileOpt) {
        String primaryRole = user.getRoles().isEmpty() ? "STUDENT" : user.getRoles().iterator().next();
        return new UserAuthDto(
                user.getId(),
                user.getFullName(),
                user.getPhone(),
                user.getEmail(),
                primaryRole,
                user.getRoles(),
                profileOpt.map(UserProfileEntity::getDistrict).orElse(null),
                profileOpt.map(UserProfileEntity::getMandal).orElse(null),
                profileOpt.map(UserProfileEntity::getVillage).orElse(null),
                profileOpt.map(UserProfileEntity::getQualification).orElse(null),
                user.getLocale()
        );
    }
}
