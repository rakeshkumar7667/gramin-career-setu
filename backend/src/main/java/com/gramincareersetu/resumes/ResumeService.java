package com.gramincareersetu.resumes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gramincareersetu.common.BadRequestException;
import com.gramincareersetu.common.ResourceNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);

    private final ResumeRepository resumeRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public ResumeService(ResumeRepository resumeRepository, ObjectMapper objectMapper) {
        this.resumeRepository = resumeRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public ResumeDto getResumeByUserId(UUID userId) {
        ResumeEntity resume = resumeRepository.findTopByUserIdOrderByUpdatedAtDesc(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "userId", userId));
        return ResumeDto.fromEntity(resume);
    }

    @Transactional
    public ResumeDto saveResume(UUID userId, SaveResumeRequest request) {
        AtsEvaluationDto evaluation = evaluateAts(request.resumeJson());

        ResumeEntity entity = resumeRepository.findTopByUserIdOrderByUpdatedAtDesc(userId)
                .orElseGet(() -> new ResumeEntity(userId, request.templateId(), request.resumeJson(), evaluation.atsScore(), evaluation.resumeScore()));

        entity.setTemplateId((request.templateId() != null && !request.templateId().isBlank()) ? request.templateId() : "modern");
        entity.setResumeJson(request.resumeJson());
        entity.setAtsScore(evaluation.atsScore());
        entity.setResumeScore(evaluation.resumeScore());

        ResumeEntity saved = resumeRepository.save(entity);
        log.info("Saved resume for user {} with ATS score: {}", userId, saved.getAtsScore());
        return ResumeDto.fromEntity(saved);
    }

    public AtsEvaluationDto evaluateAts(String resumeJson) {
        if (resumeJson == null || resumeJson.isBlank()) {
            throw new BadRequestException("Resume JSON cannot be empty");
        }

        if (resumeJson.length() > 100_000) {
            throw new BadRequestException("Resume payload exceeds maximum permitted size of 100KB");
        }

        try {
            JsonNode root = objectMapper.readTree(resumeJson);
            if (!root.isObject()) {
                throw new BadRequestException("Resume payload must be a valid JSON object");
            }

            int contactScore = 0;
            int objectiveScore = 0;
            int educationScore = 0;
            int skillsScore = 0;
            int experienceScore = 0;
            List<String> recommendations = new ArrayList<>();

            // 1. Contact verification (20 pts)
            if (hasText(root, "fullName")) contactScore += 5;
            else recommendations.add("Add your full name in personal details");

            if (hasText(root, "phone")) contactScore += 5;
            else recommendations.add("Add a valid 10-digit mobile number for recruiter outreach");

            if (hasText(root, "email")) contactScore += 5;
            else recommendations.add("Add a professional email address");

            if (hasText(root, "address") || hasText(root, "village")) contactScore += 5;
            else recommendations.add("Add your village, mandal, or district location");

            // 2. Career Objective (15 pts)
            String objective = getText(root, "objective");
            if (objective.length() >= 30) {
                objectiveScore = 15;
            } else if (!objective.isEmpty()) {
                objectiveScore = 8;
                recommendations.add("Expand your career objective to clearly articulate your rural employment goals (minimum 30 characters)");
            } else {
                recommendations.add("Add a tailored career objective to introduce your career aspirations");
            }

            // 3. Education (20 pts)
            JsonNode eduNode = root.get("education");
            if (eduNode != null && eduNode.isArray() && eduNode.size() > 0) {
                educationScore = 20;
            } else if (hasText(root, "qualification")) {
                educationScore = 15;
            } else {
                recommendations.add("Add your educational qualifications (10th, Intermediate, Degree or ITI)");
            }

            // 4. Skills (20 pts)
            JsonNode skillsNode = root.get("skills");
            if (skillsNode != null && skillsNode.isArray() && skillsNode.size() >= 3) {
                skillsScore = 20;
            } else if (skillsNode != null && skillsNode.isArray() && skillsNode.size() > 0) {
                skillsScore = 12;
                recommendations.add("Add at least 3-5 specific technical and functional skills to pass ATS filtering");
            } else if (hasText(root, "skills")) {
                skillsScore = 15;
            } else {
                recommendations.add("Include key technical or vocational skills (e.g. MS Office, Electrical, Typing, Tally)");
            }

            // 5. Projects or Experience (25 pts)
            JsonNode projectsNode = root.get("projects");
            JsonNode expNode = root.get("experience");
            boolean hasProjects = projectsNode != null && projectsNode.isArray() && projectsNode.size() > 0;
            boolean hasExp = expNode != null && expNode.isArray() && expNode.size() > 0;

            if (hasProjects && hasExp) {
                experienceScore = 25;
            } else if (hasProjects || hasExp) {
                experienceScore = 18;
            } else {
                recommendations.add("Add at least one hands-on project, internship, or vocational experience to stand out");
            }

            int totalAts = contactScore + objectiveScore + educationScore + skillsScore + experienceScore;
            int resumeQualityScore = (int) Math.min(100, Math.round(totalAts * 0.95 + 5));

            String grade;
            if (totalAts >= 85) grade = "Excellent";
            else if (totalAts >= 70) grade = "Good";
            else if (totalAts >= 50) grade = "Fair";
            else grade = "Needs Improvement";

            Map<String, Integer> breakdown = new HashMap<>();
            breakdown.put("contact", contactScore);
            breakdown.put("objective", objectiveScore);
            breakdown.put("education", educationScore);
            breakdown.put("skills", skillsScore);
            breakdown.put("experience", experienceScore);

            return new AtsEvaluationDto(totalAts, resumeQualityScore, grade, breakdown, recommendations);
        } catch (Exception e) {
            log.error("Failed to parse resume JSON for ATS evaluation: ", e);
            throw new BadRequestException("Malformed resume JSON format: " + e.getMessage());
        }
    }

    private boolean hasText(JsonNode root, String field) {
        return root.hasNonNull(field) && !root.get(field).asText().trim().isEmpty();
    }

    private String getText(JsonNode root, String field) {
        return root.hasNonNull(field) ? root.get(field).asText().trim() : "";
    }
}
