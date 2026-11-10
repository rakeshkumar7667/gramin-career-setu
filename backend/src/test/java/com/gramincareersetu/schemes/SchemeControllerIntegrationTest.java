package com.gramincareersetu.schemes;

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
class SchemeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/v1/schemes - returns paginated seeded government schemes")
    void testGetSchemesPaginated() throws Exception {
        mockMvc.perform(get("/api/v1/schemes")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$.data.content[0].id", startsWith("SCHEME-")));
    }

    @Test
    @DisplayName("GET /api/v1/schemes?all=true - returns all active schemes as a flat list")
    void testGetAllSchemes() throws Exception {
        mockMvc.perform(get("/api/v1/schemes?all=true")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(4))))
                .andExpect(jsonPath("$.data[0].titleTe", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/schemes/{id} - returns single government scheme detail")
    void testGetSchemeById() throws Exception {
        mockMvc.perform(get("/api/v1/schemes/SCHEME-01")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is("SCHEME-01")))
                .andExpect(jsonPath("$.data.titleEn", containsString("Pradhan Mantri MUDRA Yojana")));
    }
}
