package com.gramincareersetu.users;

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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "ravi_user", roles = {"STUDENT"})
    @DisplayName("GET /api/v1/users/me - returns authenticated user identity")
    void testGetCurrentUser() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", notNullValue()))
                .andExpect(jsonPath("$.data.status", is("ACTIVE")));
    }

    @Test
    @WithMockUser(username = "ravi_user", roles = {"STUDENT"})
    @DisplayName("PUT /api/v1/users/profile - updates demographic details")
    void testUpdateProfile() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest(
                "Ravi Teja Kalisetty",
                "9848022338",
                "te",
                "SPSR Nellore",
                "Gudur",
                "Chillakur",
                "B.Tech in CSE",
                "Software Engineering",
                "{\"github\":\"https://github.com/raviteja\"}"
        );

        mockMvc.perform(put("/api/v1/users/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", is("Ravi Teja Kalisetty")))
                .andExpect(jsonPath("$.data.phone", is("9848022338")))
                .andExpect(jsonPath("$.data.profile.district", is("SPSR Nellore")))
                .andExpect(jsonPath("$.data.profile.qualification", is("B.Tech in CSE")));
    }
}
