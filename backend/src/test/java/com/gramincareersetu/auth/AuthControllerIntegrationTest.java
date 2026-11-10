package com.gramincareersetu.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gramincareersetu.auth.dto.LoginRequest;
import com.gramincareersetu.auth.dto.SendOtpRequest;
import com.gramincareersetu.auth.dto.SignupRequest;
import com.gramincareersetu.auth.dto.VerifyOtpRequest;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/auth/signup - registers new user and returns JWT token")
    void testSignupSuccess() throws Exception {
        SignupRequest request = new SignupRequest(
                "Geetha Reddy",
                "9876501234",
                "password123",
                "STUDENT",
                "Kadapa",
                "Rayachoti",
                "Vempalli",
                "B.Com"
        );

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.phone", is("9876501234")))
                .andExpect(jsonPath("$.data.user.fullName", is("Geetha Reddy")));
    }

    @Test
    @DisplayName("POST /api/v1/auth/signup - rejects duplicate mobile registration")
    void testSignupDuplicatePhoneFails() throws Exception {
        // 9876543210 is seeded by AuthDataInitializer
        SignupRequest request = new SignupRequest(
                "Duplicate User",
                "9876543210",
                "password123",
                "STUDENT",
                "Anantapur",
                "Dharmavaram",
                "Village",
                "10th Pass"
        );

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("already registered")));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login - authenticates seeded demo student and returns JWT")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("9876543210", "password123");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.fullName", is("Ravi Kumar")));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login - rejects wrong password")
    void testLoginWrongPasswordFails() throws Exception {
        LoginRequest request = new LoginRequest("9876543210", "wrongpassword");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("POST /api/v1/auth/otp/send & verify - sends and verifies OTP")
    void testOtpFlow() throws Exception {
        SendOtpRequest sendReq = new SendOtpRequest("9848011223", "SIGNUP");

        mockMvc.perform(post("/api/v1/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // Test demo verification code 123456
        VerifyOtpRequest verifyReq = new VerifyOtpRequest("9848011223", "123456");

        mockMvc.perform(post("/api/v1/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.valid", is(true)));
    }

    @Test
    @DisplayName("GET /api/v1/auth/me - gets authenticated user profile with Bearer JWT")
    void testMeWithJwtToken() throws Exception {
        LoginRequest request = new LoginRequest("9876543210", "password123");

        String responseBody = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(responseBody).path("data").path("token").asText();

        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.phone", is("9876543210")));
    }
}
