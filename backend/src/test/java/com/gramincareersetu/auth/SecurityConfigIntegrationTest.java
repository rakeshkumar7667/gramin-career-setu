package com.gramincareersetu.auth;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class SecurityConfigIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/v1/users/me with arbitrary bearer token - must return 401 Unauthorized")
    void testArbitraryTokenRejected() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer arbitrary-forged-token-12345")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/v1/users/me without authorization - must return 401 Unauthorized")
    void testUnauthenticatedUserMeRejected() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/v1/admin/stats with student token - must return 403 Forbidden")
    void testStudentRoleForbiddenOnAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer test-token.student_user.ROLE_STUDENT")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /actuator/health/liveness - public probe returns 200 UP")
    void testPublicLivenessProbe() throws Exception {
        mockMvc.perform(get("/actuator/health/liveness"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));
    }

    @Test
    @DisplayName("GET /actuator/health/readiness - public probe returns 200 UP")
    void testPublicReadinessProbe() throws Exception {
        mockMvc.perform(get("/actuator/health/readiness"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));
    }

    @Test
    @DisplayName("GET /actuator/metrics - unauthenticated must be blocked (401 or 403)")
    void testActuatorMetricsRestricted() throws Exception {
        mockMvc.perform(get("/actuator/metrics"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /v3/api-docs - public OpenAPI specification returns 200")
    void testOpenApiDocsPublic() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.openapi", notNullValue()))
                .andExpect(jsonPath("$.info.title", is("Gramin Career Setu REST API")));
    }

    @Test
    @DisplayName("Endpoints that store personal data must reject anonymous callers")
    void testPersonalDataEndpointsRequireAuthentication() throws Exception {
        // These three were permitAll. /jobs/{id}/apply accepted a name, phone
        // and village from anyone on the internet, and /workshops/{id}/cancel
        // identified the registrant by phone number alone, so guessing a
        // number cancelled a real student's place.
        String applicant = "{\"applicantName\":\"Test\",\"phone\":\"9876543210\",\"village\":\"Testpalli\"}";

        mockMvc.perform(post("/api/v1/jobs/J01/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(applicant))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/v1/workshops/W01/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test\",\"phone\":\"9876543210\"}"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/v1/workshops/W01/cancel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"9876543210\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Reading public career information stays open to everyone")
    void testPublicReadsRemainOpen() throws Exception {
        // The point of the site is that a student can browse without an
        // account; the lockdown above must not have closed that off.
        mockMvc.perform(get("/api/v1/jobs")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/workshops")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/schemes")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/scholarships")).andExpect(status().isOk());
    }
}
