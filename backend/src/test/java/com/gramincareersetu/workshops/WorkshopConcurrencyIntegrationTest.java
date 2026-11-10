package com.gramincareersetu.workshops;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class WorkshopConcurrencyIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WorkshopRepository workshopRepository;

    @Autowired
    private WorkshopRegistrationRepository registrationRepository;

    @Test
    @DisplayName("Concurrent registrations with capacity limit: exactly capacity registrations succeed, excess rejected")
    void testConcurrentRegistrationsRespectCapacity() throws Exception {
        String workshopId = "WS-CAP-TEST-" + System.currentTimeMillis();
        int capacity = 3;

        WorkshopEntity workshop = new WorkshopEntity(
                workshopId,
                "సామర్థ్య పరీక్ష వర్క్‌షాప్",
                "Capacity Concurrency Workshop",
                "Technical",
                "Tester",
                Instant.now().plus(7, ChronoUnit.DAYS),
                capacity
        );
        workshopRepository.save(workshop);

        int totalThreads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(totalThreads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(totalThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger rejectedCount = new AtomicInteger(0);
        List<String> errors = Collections.synchronizedList(new ArrayList<>());

        for (int i = 0; i < totalThreads; i++) {
            final int index = i;
            final String phone = String.format("9876543%03d", index);
            executor.submit(() -> {
                try {
                    startLatch.await(); // Synchronize all threads to fire simultaneously

                    RegisterWorkshopRequest request = new RegisterWorkshopRequest(
                            "Applicant " + index,
                            phone,
                            "IDEMP-CONCUR-" + index
                    );

                    MvcResult result = mockMvc.perform(post("/api/v1/workshops/" + workshopId + "/register")
                        .with(user("student_user").roles("STUDENT"))
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(objectMapper.writeValueAsString(request)))
                            .andReturn();

                    int statusCode = result.getResponse().getStatus();
                    if (statusCode == 201) {
                        successCount.incrementAndGet();
                    } else if (statusCode == 400) {
                        rejectedCount.incrementAndGet();
                    } else {
                        errors.add("Unexpected status: " + statusCode);
                    }
                } catch (Exception e) {
                    errors.add(e.getMessage());
                } finally {
                    finishLatch.countDown();
                }
            });
        }

        startLatch.countDown(); // Fire all threads
        boolean finished = finishLatch.await(15, TimeUnit.SECONDS);
        executor.shutdown();

        assertEquals(true, finished, "Concurrency execution timed out");
        assertEquals(0, errors.size(), "Unexpected errors during concurrency: " + errors);
        assertEquals(capacity, successCount.get(), "Exactly " + capacity + " registrations must succeed");
        assertEquals(totalThreads - capacity, rejectedCount.get(), (totalThreads - capacity) + " registrations must be rejected");

        long actualDbCount = registrationRepository.countByWorkshopId(workshopId);
        assertEquals(capacity, actualDbCount, "Database count must match capacity exactly");
    }

    @Test
    @DisplayName("Workshop cancellation endpoint frees slot and allows new registration")
    void testCancellationReleasesSlot() throws Exception {
        String workshopId = "WS-CANCEL-TEST-" + System.currentTimeMillis();
        int capacity = 1;

        WorkshopEntity workshop = new WorkshopEntity(
                workshopId,
                "రద్దు పరీక్ష",
                "Cancellation Test Workshop",
                "General",
                "Speaker",
                Instant.now().plus(5, ChronoUnit.DAYS),
                capacity
        );
        workshopRepository.save(workshop);

        String phone1 = "9111111111";
        String phone2 = "9222222222";

        // Register 1st participant
        mockMvc.perform(post("/api/v1/workshops/" + workshopId + "/register")
                        .with(user("student_user").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterWorkshopRequest("User 1", phone1, "IDEMP-C1"))))
                .andExpect(status().isCreated());

        // 2nd participant rejected (capacity full)
        mockMvc.perform(post("/api/v1/workshops/" + workshopId + "/register")
                        .with(user("student_user").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterWorkshopRequest("User 2", phone2, "IDEMP-C2"))))
                .andExpect(status().isBadRequest());

        // Cancel 1st participant
        mockMvc.perform(post("/api/v1/workshops/" + workshopId + "/cancel")
                        .with(user("student_user").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CancelWorkshopRequest(phone1, "IDEMP-C1"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // 2nd participant can now successfully register
        mockMvc.perform(post("/api/v1/workshops/" + workshopId + "/register")
                        .with(user("student_user").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterWorkshopRequest("User 2", phone2, "IDEMP-C2-RETRY"))))
                .andExpect(status().isCreated());
    }
}
