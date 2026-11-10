package com.gramincareersetu.users;

import com.gramincareersetu.common.BadRequestException;
import com.gramincareersetu.common.ResourceNotFoundException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;

    @Autowired
    public UserService(UserRepository userRepository, UserProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public UserEntity getOrCreateUserFromPrincipal(String keycloakId, String email, String fullName, Set<String> roles) {
        Optional<UserEntity> existingUser = Optional.empty();

        if (keycloakId != null && !keycloakId.isBlank()) {
            existingUser = userRepository.findByKeycloakId(keycloakId);
        }

        if (existingUser.isEmpty() && email != null && !email.isBlank()) {
            existingUser = userRepository.findByEmail(email);
        }

        if (existingUser.isPresent()) {
            UserEntity user = existingUser.get();
            boolean changed = false;

            if (keycloakId != null && user.getKeycloakId() == null) {
                user.setKeycloakId(keycloakId);
                changed = true;
            }

            if (fullName != null && !fullName.isBlank() && !fullName.equals(user.getFullName())) {
                user.setFullName(fullName);
                changed = true;
            }

            if (roles != null && !roles.isEmpty() && !user.getRoles().containsAll(roles)) {
                user.getRoles().addAll(roles);
                changed = true;
            }

            if (changed) {
                user = userRepository.save(user);
            }
            return user;
        }

        // Provision new user
        UUID newUserId = UUID.randomUUID();
        UserEntity newUser = new UserEntity(
                newUserId,
                keycloakId,
                email,
                null,
                (fullName != null && !fullName.isBlank()) ? fullName : "Gramin Scholar",
                "te"
        );

        Set<String> assignedRoles = new HashSet<>();
        assignedRoles.add("ROLE_STUDENT");
        if (roles != null) {
            assignedRoles.addAll(roles);
        }
        newUser.setRoles(assignedRoles);

        UserEntity savedUser = userRepository.save(newUser);

        UserProfileEntity initialProfile = new UserProfileEntity(
                savedUser.getId(),
                null,
                null,
                null,
                null,
                null,
                "{}"
        );
        profileRepository.save(initialProfile);

        log.info("Provisioned new user account: id={}, email={}", savedUser.getId(), com.gramincareersetu.common.PiiUtils.maskEmail(savedUser.getEmail()));
        return savedUser;
    }

    @Transactional(readOnly = true)
    public UserDto getUserDtoById(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        UserProfileEntity profile = profileRepository.findByUserId(userId).orElse(null);
        return UserDto.fromEntity(user, profile);
    }

    @Transactional
    public UserDto updateProfile(UUID userId, UpdateProfileRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName().trim());
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            String cleanPhone = request.phone().trim();
            if (!cleanPhone.equals(user.getPhone()) && userRepository.existsByPhone(cleanPhone)) {
                throw new BadRequestException("Phone number is already associated with another account");
            }
            user.setPhone(cleanPhone);
        }
        if (request.locale() != null && !request.locale().isBlank()) {
            user.setLocale(request.locale().trim().toLowerCase());
        }

        userRepository.save(user);

        UserProfileEntity profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> new UserProfileEntity(userId, null, null, null, null, null, "{}"));

        if (request.district() != null) profile.setDistrict(request.district().trim());
        if (request.mandal() != null) profile.setMandal(request.mandal().trim());
        if (request.village() != null) profile.setVillage(request.village().trim());
        if (request.qualification() != null) profile.setQualification(request.qualification().trim());
        if (request.careerInterest() != null) profile.setCareerInterest(request.careerInterest().trim());
        if (request.profileJson() != null) profile.setProfileJson(request.profileJson());

        UserProfileEntity savedProfile = profileRepository.save(profile);
        log.info("Updated profile for user: {}", userId);
        return UserDto.fromEntity(user, savedProfile);
    }
}
