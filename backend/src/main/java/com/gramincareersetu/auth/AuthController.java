package com.gramincareersetu.auth;

import com.gramincareersetu.auth.dto.AuthResponse;
import com.gramincareersetu.auth.dto.LoginRequest;
import com.gramincareersetu.auth.dto.ResetPasswordRequest;
import com.gramincareersetu.auth.dto.SendOtpRequest;
import com.gramincareersetu.auth.dto.SignupRequest;
import com.gramincareersetu.auth.dto.UserAuthDto;
import com.gramincareersetu.auth.dto.VerifyOtpRequest;
import com.gramincareersetu.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Native user registration, authentication, OTP verification, and password management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @Operation(summary = "Register a new user account with phone and password")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user with mobile number and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/otp/send")
    @Operation(summary = "Generate and send 6-digit OTP to mobile number")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        String code = authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "message", "OTP sent successfully to " + request.phone(),
                "expiresInSeconds", 300,
                "debugOtp", code // exposed for offline/local developer convenience
        )));
    }

    @PostMapping("/otp/verify")
    @Operation(summary = "Verify submitted 6-digit OTP")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean valid = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("valid", valid, "message", "OTP verified successfully")));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using verified OTP")
    public ResponseEntity<ApiResponse<Map<String, String>>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "Password has been successfully updated. You may now sign in.")));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserAuthDto>> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Not authenticated"));
        }
        try {
            UUID userId = UUID.fromString(authentication.getName());
            UserAuthDto user = authService.getCurrentUser(userId);
            return ResponseEntity.ok(ApiResponse.ok(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Invalid user identifier in token"));
        }
    }
}
