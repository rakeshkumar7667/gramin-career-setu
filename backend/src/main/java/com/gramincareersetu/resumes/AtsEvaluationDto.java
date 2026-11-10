package com.gramincareersetu.resumes;

import java.util.List;
import java.util.Map;

public record AtsEvaluationDto(
        int atsScore,
        int resumeScore,
        String grade,
        Map<String, Integer> breakdown,
        List<String> recommendations
) {}
