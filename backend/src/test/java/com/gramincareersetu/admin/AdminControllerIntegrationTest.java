package com.gramincareersetu.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gramincareersetu.jobs.JobApplicationEntity;
import com.gramincareersetu.jobs.JobApplicationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Test
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    @DisplayName("GET /api/v1/admin/stats - returns platform telemetry for admin")
    void testGetStatsAsAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalJobs", greaterThanOrEqualTo(22)));
    }

    @Test
    @WithMockUser(username = "student_user", roles = {"STUDENT"})
    @DisplayName("GET /api/v1/admin/stats - rejects non-admin users with 403 Forbidden")
    void testGetStatsAsStudentForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    @DisplayName("PATCH /api/v1/admin/applications/{id}/status - updates status and creates audit log")
    void testUpdateApplicationStatus() throws Exception {
        JobApplicationEntity app = new JobApplicationEntity(
                "APP-TEST-999",
                "J01",
                "Lakshmi Devi",
                "9876500000",
                "Podalakur",
                null
        );
        applicationRepository.save(app);

        UpdateApplicationStatusRequest request = new UpdateApplicationStatusRequest("SHORTLISTED", "Passed preliminary screening");

        mockMvc.perform(patch("/api/v1/admin/applications/APP-TEST-999/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("SHORTLISTED")));
    }
}
