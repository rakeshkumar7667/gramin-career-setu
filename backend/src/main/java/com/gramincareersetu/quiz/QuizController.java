package com.gramincareersetu.quiz;

import com.gramincareersetu.common.ApiResponse;
import com.gramincareersetu.users.UserEntity;
import com.gramincareersetu.users.UserService;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/quiz")
public class QuizController {

    private final QuizService quizService;
    private final UserService userService;

    public QuizController(QuizService quizService, UserService userService) {
        this.quizService = quizService;
        this.userService = userService;
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<QuizRecommendationDto>> submitQuiz(
            @Valid @RequestBody QuizSubmissionRequest request,
            Authentication authentication
    ) {
        UUID userId = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            UserEntity user = resolveUser(authentication);
            if (user != null) {
                userId = user.getId();
            }
        }

        QuizRecommendationDto recommendation = quizService.evaluateAndSaveQuiz(request, userId);
        return ResponseEntity.ok(ApiResponse.ok("Quiz evaluated successfully", recommendation));
    }

    @GetMapping("/my-results")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<QuizAttemptEntity>>> getMyResults(Authentication authentication) {
        UserEntity user = resolveUser(authentication);
        List<QuizAttemptEntity> attempts = quizService.getUserQuizAttempts(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Candidate quiz history retrieved", attempts));
    }

    private UserEntity resolveUser(Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String keycloakId = null;
        String email = null;
        String fullName = null;

        if (authentication.getPrincipal() instanceof Jwt jwt) {
            keycloakId = jwt.getSubject();
            email = jwt.getClaimAsString("email");
            fullName = jwt.getClaimAsString("name");
            if (fullName == null) {
                fullName = jwt.getClaimAsString("preferred_username");
            }
        } else {
            keycloakId = authentication.getName();
            email = authentication.getName() + "@gramincareersetu.org";
            fullName = authentication.getName();
        }

        return userService.getOrCreateUserFromPrincipal(keycloakId, email, fullName, roles);
    }
}
