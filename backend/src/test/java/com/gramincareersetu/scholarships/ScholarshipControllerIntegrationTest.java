package com.gramincareersetu.scholarships;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class ScholarshipControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/v1/scholarships - returns paginated seeded scholarships")
    void testGetScholarshipsPaginated() throws Exception {
        mockMvc.perform(get("/api/v1/scholarships")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$.data.content[0].id", startsWith("SCH-")));
    }

    @Test
    @DisplayName("GET /api/v1/scholarships?all=true - returns all active scholarships as a flat list")
    void testGetAllScholarships() throws Exception {
        mockMvc.perform(get("/api/v1/scholarships?all=true")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$.data[0].titleTe", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/scholarships/{id} - returns single scholarship detail")
    void testGetScholarshipById() throws Exception {
        mockMvc.perform(get("/api/v1/scholarships/SCH-01")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is("SCH-01")))
                .andExpect(jsonPath("$.data.titleEn", containsString("Post-Matric Fee Reimbursement")));
    }
}
