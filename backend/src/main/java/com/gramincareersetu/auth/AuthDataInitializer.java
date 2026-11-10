package com.gramincareersetu.auth;

import com.gramincareersetu.users.UserEntity;
import com.gramincareersetu.users.UserProfileEntity;
import com.gramincareersetu.users.UserProfileRepository;
import com.gramincareersetu.users.UserRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AuthDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AuthDataInitializer.class);

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordService passwordService;

    public AuthDataInitializer(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            PasswordService passwordService
    ) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordService = passwordService;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedUserIfNotExists(
                "9876543210",
                "Ravi Kumar",
                "password123",
                Set.of("STUDENT"),
                "Anantapur",
                "Bukkarayasamudram",
                "B.Sc Computers"
        );

        seedUserIfNotExists(
                "9440123456",
                "Suresh Babu",
                "password123",
                Set.of("VOLUNTEER"),
                "Kurnool",
                "Alur",
                "M.A Social Work"
        );

        seedUserIfNotExists(
                "9848012345",
                "District Admin",
                "password123",
                Set.of("ADMIN", "SUPER_ADMIN"),
                "Anantapur",
                "Collectorate",
                "State Administration"
        );
    }

    private void seedUserIfNotExists(
            String phone,
            String fullName,
            String password,
            Set<String> roles,
            String district,
            String village,
            String qualification
    ) {
        if (!userRepository.existsByPhone(phone)) {
            UserEntity user = new UserEntity();
            user.setId(UUID.randomUUID());
            user.setPhone(phone);
            user.setFullName(fullName);
            user.setPasswordHash(passwordService.hash(password));
            user.setRoles(new HashSet<>(roles));
            user.setStatus("ACTIVE");
            user.setLocale("te");

            UserEntity savedUser = userRepository.save(user);

            UserProfileEntity profile = new UserProfileEntity();
            profile.setId(UUID.randomUUID());
            profile.setUserId(savedUser.getId());
            profile.setDistrict(district);
            profile.setVillage(village);
            profile.setQualification(qualification);
            userProfileRepository.save(profile);

            log.info("Seeded demo user in database: phone={}, roles={}", phone, roles);
        }
    }
}
