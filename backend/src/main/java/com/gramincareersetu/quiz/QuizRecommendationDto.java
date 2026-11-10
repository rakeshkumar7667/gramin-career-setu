package com.gramincareersetu.quiz;

import com.gramincareersetu.jobs.JobDto;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record QuizRecommendationDto(
        UUID attemptId,
        String recommendedTrack,
        String titleTe,
        String titleEn,
        String summaryTe,
        String summaryEn,
        Map<String, Integer> categoryScores,
        List<JobDto> matchingJobs,
        List<String> roadmapSteps
) {}
