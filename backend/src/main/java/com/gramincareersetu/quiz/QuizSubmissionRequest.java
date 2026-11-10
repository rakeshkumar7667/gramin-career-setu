package com.gramincareersetu.quiz;

import jakarta.validation.constraints.NotEmpty;
import java.util.Map;

public record QuizSubmissionRequest(
        @NotEmpty(message = "Quiz answers map cannot be empty")
        Map<String, String> answers,

        String qualification
) {}
