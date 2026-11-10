package com.gramincareersetu.workshops;

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
class WorkshopControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/v1/workshops - returns seeded upcoming workshops")
    void testGetUpcomingWorkshops() throws Exception {
        mockMvc.perform(get("/api/v1/workshops")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].id", startsWith("WS-")));
    }

    @Test
    @DisplayName("POST /api/v1/workshops/{id}/register - successfully registers participant")
    void testRegisterForWorkshop() throws Exception {
        RegisterWorkshopRequest request = new RegisterWorkshopRequest(
                "S. Venkat",
                "9123456780",
                "IDEMP-" + System.currentTimeMillis()
        );

        mockMvc.perform(post("/api/v1/workshops/WS-101/register")
                        .with(user("student_user").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", is("S. Venkat")))
                .andExpect(jsonPath("$.data.workshopId", is("WS-101")));
    }
}
