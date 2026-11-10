package com.gramincareersetu.quiz;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class QuizControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/quiz/submit (public) - evaluates answers and recommends technical track")
    void testPublicQuizSubmissionTechnical() throws Exception {
        QuizSubmissionRequest request = new QuizSubmissionRequest(
                Map.of(
                        "q1", "3", // hands-on practical work
                        "q2", "0", // love fixing machines
                        "q3", "3", // quiet work
                        "q4", "0", // 10th class
                        "q5", "0"  // interested in trade
                ),
                "10th Standard"
        );

        mockMvc.perform(post("/api/v1/quiz/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.recommendedTrack", is("iti")))
                .andExpect(jsonPath("$.data.titleEn", containsString("Technical")))
                .andExpect(jsonPath("$.data.matchingJobs", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.roadmapSteps", hasSize(3)))
                .andExpect(jsonPath("$.data.categoryScores.technical", greaterThan(0)));
    }

    @Test
    @DisplayName("POST /api/v1/quiz/submit (public) - evaluates answers and recommends government track")
    void testPublicQuizSubmissionGovernment() throws Exception {
        QuizSubmissionRequest request = new QuizSubmissionRequest(
                Map.of(
                        "q1", "0", // comfortable with math
                        "q2", "2", // paperwork/analytical
                        "q3", "3", // quiet/focused
                        "q4", "2", // Degree
                        "q5", "2"  // stable salaried job
                ),
                "B.Sc Mathematics"
        );

        mockMvc.perform(post("/api/v1/quiz/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.recommendedTrack", is("government")))
                .andExpect(jsonPath("$.data.titleEn", containsString("Government")))
                .andExpect(jsonPath("$.data.matchingJobs", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @WithMockUser(username = "candidate_anitha", roles = {"STUDENT"})
    @DisplayName("POST /api/v1/quiz/submit & GET /api/v1/quiz/my-results - authenticated candidate flow")
    void testAuthenticatedQuizFlow() throws Exception {
        QuizSubmissionRequest request = new QuizSubmissionRequest(
                Map.of(
                        "q1", "1",
                        "q2", "0",
                        "q3", "0",
                        "q4", "1",
                        "q5", "0"
                ),
                "Intermediate"
        );

        mockMvc.perform(post("/api/v1/quiz/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.attemptId", notNullValue()));

        mockMvc.perform(get("/api/v1/quiz/my-results")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].recommendedTrack", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/quiz/my-results (unauthenticated) - returns 401 Unauthorized")
    void testUnauthenticatedGetResults() throws Exception {
        mockMvc.perform(get("/api/v1/quiz/my-results")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
