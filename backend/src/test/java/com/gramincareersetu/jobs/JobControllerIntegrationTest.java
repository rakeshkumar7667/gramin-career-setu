package com.gramincareersetu.jobs;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class JobControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/v1/jobs - returns seeded jobs with pagination")
    void testGetJobs() throws Exception {
        mockMvc.perform(get("/api/v1/jobs")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.totalElements", greaterThanOrEqualTo(22)))
                .andExpect(jsonPath("$.data.content[0].id", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/jobs - filters by category=government")
    void testFilterGovernmentJobs() throws Exception {
        mockMvc.perform(get("/api/v1/jobs")
                        .param("category", "government")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.content[*].category", everyItem(equalToIgnoringCase("government"))));
    }

    @Test
    @DisplayName("GET /api/v1/jobs/{id} - returns specific job detail")
    void testGetJobById() throws Exception {
        mockMvc.perform(get("/api/v1/jobs/J01")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is("J01")))
                .andExpect(jsonPath("$.data.titleEn", is("Grama Sachivalayam Roles")));
    }

    @Test
    @DisplayName("POST /api/v1/jobs/{id}/apply - successfully submits application")
    void testApplyForJob() throws Exception {
        ApplyJobRequest request = new ApplyJobRequest(
                "K. Ravi Teja",
                "9876543210",
                "Gudur, Nellore"
        );

        mockMvc.perform(post("/api/v1/jobs/J01/apply")
                        .with(user("student_user").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", startsWith("APP-")))
                .andExpect(jsonPath("$.data.applicantName", is("K. Ravi Teja")))
                .andExpect(jsonPath("$.data.jobId", is("J01")));
    }

    @Test
    @DisplayName("POST /api/v1/jobs/{id}/apply - validates required fields")
    void testApplyForJobValidation() throws Exception {
        ApplyJobRequest invalidRequest = new ApplyJobRequest(
                "",
                "invalid-phone",
                ""
        );

        mockMvc.perform(post("/api/v1/jobs/J01/apply")
                        .with(user("student_user").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.data.applicantName", notNullValue()))
                .andExpect(jsonPath("$.data.phone", notNullValue()));
    }
}
