package com.gramincareersetu.common;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@TestPropertySource(properties = {
        "app.rate-limiting.enabled=true",
        "app.rate-limiting.max-requests-per-minute=3"
})
@DirtiesContext
class RateLimitIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should throttle requests and return 429 Too Many Requests after exceeding threshold")
    void shouldRateLimitExceededRequests() throws Exception {
        String payload = objectMapper.writeValueAsString(Map.of(
                "answers", Map.of("q1", "A"),
                "qualification", "10th"
        ));

        // 1st request -> ok (200)
        mockMvc.perform(post("/api/v1/quiz/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .with(req -> {
                            req.setRemoteAddr("192.168.1.50");
                            return req;
                        }))
                .andExpect(status().isOk());

        // 2nd request -> ok (200)
        mockMvc.perform(post("/api/v1/quiz/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .with(req -> {
                            req.setRemoteAddr("192.168.1.50");
                            return req;
                        }))
                .andExpect(status().isOk());

        // 3rd request -> ok (200)
        mockMvc.perform(post("/api/v1/quiz/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .with(req -> {
                            req.setRemoteAddr("192.168.1.50");
                            return req;
                        }))
                .andExpect(status().isOk());

        // 4th request -> throttled (429)
        mockMvc.perform(post("/api/v1/quiz/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .with(req -> {
                            req.setRemoteAddr("192.168.1.50");
                            return req;
                        }))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string("Retry-After", "60"))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Too many requests from this address. Please wait a minute before submitting again."));
    }
}
