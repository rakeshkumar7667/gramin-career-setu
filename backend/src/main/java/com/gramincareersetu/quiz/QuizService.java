package com.gramincareersetu.quiz;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gramincareersetu.jobs.JobDto;
import com.gramincareersetu.jobs.JobEntity;
import com.gramincareersetu.jobs.JobRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuizService {

    private static final Logger log = LoggerFactory.getLogger(QuizService.class);

    private final QuizAttemptRepository quizAttemptRepository;
    private final JobRepository jobRepository;
    private final ObjectMapper objectMapper;

    public QuizService(QuizAttemptRepository quizAttemptRepository,
                       JobRepository jobRepository,
                       ObjectMapper objectMapper) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.jobRepository = jobRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public QuizRecommendationDto evaluateAndSaveQuiz(QuizSubmissionRequest request, UUID userId) {
        Map<String, Integer> scores = calculateDimensionScores(request.answers());

        int govScore = scores.getOrDefault(CareerTrack.GOVERNMENT.getCode(), 0);
        int itiScore = scores.getOrDefault(CareerTrack.TECHNICAL_ITI.getCode(), 0);
        int bpoScore = scores.getOrDefault(CareerTrack.VOCATIONAL_BPO.getCode(), 0);
        int busScore = scores.getOrDefault(CareerTrack.BUSINESS_ENTREPRENEUR.getCode(), 0);

        String recommendedTrack = determineTopTrack(govScore, itiScore, bpoScore, busScore);

        String answersJson;
        try {
            answersJson = objectMapper.writeValueAsString(request.answers());
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize quiz answers to JSON", e);
            answersJson = "{}";
        }

        QuizAttemptEntity attempt = new QuizAttemptEntity(
                userId,
                itiScore, // technical
                govScore, // government
                busScore, // business
                bpoScore, // vocational
                recommendedTrack,
                answersJson
        );
        attempt = quizAttemptRepository.save(attempt);

        List<JobEntity> matchingJobEntities = jobRepository
                .findByCategoryAndStatus(recommendedTrack, "ACTIVE", PageRequest.of(0, 3))
                .getContent();

        List<JobDto> matchingJobs = matchingJobEntities.stream()
                .map(JobDto::fromEntity)
                .toList();

        TrackMetadata meta = getTrackMetadata(recommendedTrack);

        Map<String, Integer> categoryScores = new LinkedHashMap<>();
        categoryScores.put("government", govScore);
        categoryScores.put("technical", itiScore);
        categoryScores.put("vocational", bpoScore);
        categoryScores.put("business", busScore);

        return new QuizRecommendationDto(
                attempt.getId(),
                recommendedTrack,
                meta.titleTe(),
                meta.titleEn(),
                meta.summaryTe(),
                meta.summaryEn(),
                categoryScores,
                matchingJobs,
                meta.roadmapSteps()
        );
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptEntity> getUserQuizAttempts(UUID userId) {
        if (userId == null) {
            return Collections.emptyList();
        }
        return quizAttemptRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private Map<String, Integer> calculateDimensionScores(Map<String, String> answers) {
        Map<String, Integer> totals = new LinkedHashMap<>();
        totals.put(CareerTrack.GOVERNMENT.getCode(), 0);
        totals.put(CareerTrack.TECHNICAL_ITI.getCode(), 0);
        totals.put(CareerTrack.VOCATIONAL_BPO.getCode(), 0);
        totals.put(CareerTrack.BUSINESS_ENTREPRENEUR.getCode(), 0);

        if (answers == null || answers.isEmpty()) {
            return totals;
        }

        // Standard Q1-Q5 scoring matrix
        for (Map.Entry<String, String> entry : answers.entrySet()) {
            String key = entry.getKey().toLowerCase(Locale.ROOT).trim();
            String val = entry.getValue().trim();
            int optIdx;
            try {
                optIdx = Integer.parseInt(val);
            } catch (NumberFormatException e) {
                // If answer was string key, try single char: '0', '1', 'A' -> 0, 'B' -> 1
                if (val.length() == 1 && Character.isDigit(val.charAt(0))) {
                    optIdx = val.charAt(0) - '0';
                } else if (val.equalsIgnoreCase("a")) {
                    optIdx = 0;
                } else if (val.equalsIgnoreCase("b")) {
                    optIdx = 1;
                } else if (val.equalsIgnoreCase("c")) {
                    optIdx = 2;
                } else if (val.equalsIgnoreCase("d")) {
                    optIdx = 3;
                } else {
                    optIdx = 0;
                }
            }

            switch (key) {
                case "q1", "1" -> applyQ1Scores(optIdx, totals);
                case "q2", "2" -> applyQ2Scores(optIdx, totals);
                case "q3", "3" -> applyQ3Scores(optIdx, totals);
                case "q4", "4" -> applyQ4Scores(optIdx, totals);
                case "q5", "5" -> applyQ5Scores(optIdx, totals);
                default -> {
                    // Check if key directly names a track
                    if (totals.containsKey(key)) {
                        totals.put(key, totals.get(key) + Math.max(1, optIdx));
                    }
                }
            }
        }

        return totals;
    }

    private void applyQ1Scores(int idx, Map<String, Integer> s) {
        switch (idx) {
            case 0 -> { add(s, "government", 3); add(s, "bpo", 1); }
            case 1 -> { add(s, "government", 2); add(s, "business", 1); }
            case 2 -> { add(s, "iti", 2); add(s, "bpo", 1); }
            case 3 -> { add(s, "iti", 3); add(s, "business", 1); }
            default -> add(s, "government", 1);
        }
    }

    private void applyQ2Scores(int idx, Map<String, Integer> s) {
        switch (idx) {
            case 0 -> { add(s, "iti", 3); add(s, "business", 1); }
            case 1 -> { add(s, "iti", 2); add(s, "business", 1); }
            case 2 -> { add(s, "government", 2); add(s, "bpo", 1); }
            case 3 -> { add(s, "government", 1); add(s, "bpo", 2); add(s, "business", 1); }
            default -> add(s, "iti", 1);
        }
    }

    private void applyQ3Scores(int idx, Map<String, Integer> s) {
        switch (idx) {
            case 0 -> { add(s, "bpo", 3); add(s, "business", 2); }
            case 1 -> { add(s, "bpo", 2); add(s, "business", 1); }
            case 2 -> { add(s, "government", 1); add(s, "bpo", 1); add(s, "business", 1); }
            case 3 -> { add(s, "government", 2); add(s, "iti", 2); }
            default -> add(s, "bpo", 1);
        }
    }

    private void applyQ4Scores(int idx, Map<String, Integer> s) {
        switch (idx) {
            case 0 -> { add(s, "iti", 3); add(s, "business", 2); }
            case 1 -> { add(s, "government", 2); add(s, "bpo", 2); add(s, "business", 1); }
            case 2 -> { add(s, "government", 3); add(s, "bpo", 2); }
            case 3 -> { add(s, "government", 1); add(s, "iti", 3); }
            default -> add(s, "government", 1);
        }
    }

    private void applyQ5Scores(int idx, Map<String, Integer> s) {
        switch (idx) {
            case 0 -> { add(s, "iti", 1); add(s, "business", 3); }
            case 1 -> { add(s, "bpo", 1); add(s, "business", 2); }
            case 2 -> { add(s, "government", 3); add(s, "iti", 1); }
            case 3 -> { add(s, "government", 1); add(s, "iti", 1); add(s, "bpo", 1); add(s, "business", 1); }
            default -> add(s, "business", 1);
        }
    }

    private void add(Map<String, Integer> map, String key, int delta) {
        map.put(key, map.getOrDefault(key, 0) + delta);
    }

    private String determineTopTrack(int gov, int iti, int bpo, int bus) {
        int max = gov;
        String top = "government";

        if (iti > max) {
            max = iti;
            top = "iti";
        }
        if (bpo > max) {
            max = bpo;
            top = "bpo";
        }
        if (bus > max) {
            top = "business";
        }
        return top;
    }

    private TrackMetadata getTrackMetadata(String track) {
        return switch (track) {
            case "iti" -> new TrackMetadata(
                    "సాంకేతిక & వృత్తి విద్యా రంగాలు",
                    "Technical & Engineering Trades (ITI)",
                    "ప్రాక్టికల్ నైపుణ్యాలు మరియు యంత్ర పరికరాల మరమ్మతులలో మీకు సహజమైన ఆసక్తి ఉంది. ITI లేదా పాలిటెక్నిక్ ట్రేడ్‌లు మీకు ప్రకాశవంతమైన భవిష్యత్తును అందిస్తాయి.",
                    "You show strong mechanical aptitude and love hands-on practical work. Technical trades like Electrician, Fitter, and Mobile Hardware technician fit you best.",
                    List.of(
                            "Identify your preferred trade on Skill India Digital portal.",
                            "Enroll in a certified Government ITI or PMKVY skill center in your district.",
                            "Complete apprenticeship training to obtain your National Trade Certificate (NTC)."
                    )
            );
            case "bpo" -> new TrackMetadata(
                    "కస్టమర్ సపోర్ట్ & డిజిటల్ సర్వీసెస్",
                    "Digital & Customer Services (BPO)",
                    "కమ్యూనికేషన్ స్కిల్స్ మరియు కంప్యూటర్ పరిజ్ఞానంతో త్వరగా ఉద్యోగంలో చేరడానికి మీకు అత్యుత్తమ సామర్థ్యం ఉంది.",
                    "Your interpersonal communication and aptitude for customer interaction make you ideal for modern services, data operations, and retail executive roles.",
                    List.of(
                            "Practice touch typing to achieve 30+ words per minute.",
                            "Complete free customer service training modules on SWAYAM / NSDC.",
                            "Create an ATS-friendly resume on Gramin Career Setu and apply to verified jobs."
                    )
            );
            case "business" -> new TrackMetadata(
                    "వ్యాపారం & స్వయం ఉపాధి",
                    "Business & Self-Employment",
                    "సొంత నిర్ణయాలతో గ్రామీణ లేదా మండల స్థాయిలో నూతన వ్యాపార అవకాశాలను సద్వినియోగం చేసుకునే వ్యవస్థాపక నైపుణ్యం మీకు ఉంది.",
                    "You possess strong entrepreneurial drive and self-direction. Starting a local enterprise, agri-business, or service shop will yield high personal returns.",
                    List.of(
                            "Conduct a local demand survey in your village or nearby mandal center.",
                            "Draft a basic project proposal estimating initial setup costs and monthly turnover.",
                            "Apply for collateral-free financing under Pradhan Mantri MUDRA Yojana (PMMY) or PMFME."
                    )
            );
            default -> new TrackMetadata(
                    "ప్రభుత్వ ఉద్యోగాలు",
                    "Government & Public Sector Jobs",
                    "మీకు క్రమశిక్షణ, లెక్కల సామర్థ్యం మరియు స్థిరమైన కెరీర్ పట్ల ఆసక్తి ఉన్నాయి. ప్రభుత్వ పోటీ పరీక్షలకు ప్రిపేర్ అవ్వడం మీకు బాగా సరిపోతుంది.",
                    "You demonstrate analytical patience and value career stability. Preparing for state recruitment, police, railways, or banking positions matches your strengths.",
                    List.of(
                            "Register on the National Career Service (NCS) portal for official notifications.",
                            "Download previous year papers for APPSC / SSC exams and schedule 3 hours of daily prep.",
                            "Access free YouTube guidance (Sakshi Education, Adda247 Telugu) and attempt weekly mock tests."
                    )
            );
        };
    }

    private record TrackMetadata(
            String titleTe,
            String titleEn,
            String summaryTe,
            String summaryEn,
            List<String> roadmapSteps
    ) {}
}
