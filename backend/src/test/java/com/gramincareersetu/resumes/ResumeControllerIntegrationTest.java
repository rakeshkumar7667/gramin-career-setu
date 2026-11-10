package com.gramincareersetu.resumes;

import com.fasterxml.jackson.databind.ObjectMapper;
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
class ResumeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String SAMPLE_RESUME_JSON = """
            {
              "fullName": "K. Ravi Teja",
              "phone": "9876543210",
              "email": "ravi.teja@example.com",
              "address": "Gudur, SPSR Nellore, AP",
              "objective": "Dedicated computer science graduate seeking an entry-level software engineering role to contribute to rural digitization initiatives.",
              "qualification": "B.Tech Computer Science and Engineering",
              "education": [
                {
                  "degree": "B.Tech in CSE",
                  "institution": "Audisankara College of Engineering",
                  "year": "2024",
                  "score": "8.5 CGPA"
                }
              ],
              "skills": ["Java", "Spring Boot", "HTML5/CSS3", "SQL", "Git"],
              "projects": [
                {
                  "title": "Gramin Career Portal",
                  "description": "Built responsive career portal serving 50+ villages with offline PWA support and Telugu localization.",
                  "tech": "JavaScript, PWA, Spring Boot"
                }
              ],
              "experience": [
                {
                  "role": "Web Intern",
                  "organization": "Local MSME Digital Hub",
                  "duration": "6 Months"
                }
              ]
            }
            """;

    @Test
    @DisplayName("POST /api/v1/resumes/calculate-ats - evaluates resume structure and returns score >= 85")
    void testCalculateAtsScore() throws Exception {
        mockMvc.perform(post("/api/v1/resumes/calculate-ats")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(SAMPLE_RESUME_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.atsScore", greaterThanOrEqualTo(85)))
                .andExpect(jsonPath("$.data.grade", is("Excellent")))
                .andExpect(jsonPath("$.data.breakdown.contact", is(20)))
                .andExpect(jsonPath("$.data.breakdown.education", is(20)))
                .andExpect(jsonPath("$.data.breakdown.skills", is(20)))
                .andExpect(jsonPath("$.data.breakdown.experience", is(25)));
    }

    @Test
    @WithMockUser(username = "test_candidate", roles = {"STUDENT"})
    @DisplayName("POST /api/v1/resumes & GET /api/v1/resumes/my-resume - saves and retrieves resume")
    void testSaveAndGetResume() throws Exception {
        SaveResumeRequest request = new SaveResumeRequest("modern", SAMPLE_RESUME_JSON);

        mockMvc.perform(post("/api/v1/resumes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.templateId", is("modern")))
                .andExpect(jsonPath("$.data.atsScore", greaterThanOrEqualTo(85)));

        mockMvc.perform(get("/api/v1/resumes/my-resume")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.templateId", is("modern")))
                .andExpect(jsonPath("$.data.atsScore", greaterThanOrEqualTo(85)));
    }
}
