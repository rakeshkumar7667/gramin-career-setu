package com.gramincareersetu;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class GraminCareerSetuApplicationTests {

    @Test
    void contextLoads() {
        // Verifies that the Spring Boot application context boots successfully with H2 and Flyway migrations
    }
}
