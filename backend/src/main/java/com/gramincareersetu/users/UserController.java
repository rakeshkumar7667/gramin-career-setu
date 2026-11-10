package com.gramincareersetu.users;

import com.gramincareersetu.auth.AuthenticatedUserResolver;
import com.gramincareersetu.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final AuthenticatedUserResolver userResolver;

    @Autowired
    public UserController(UserService userService, AuthenticatedUserResolver userResolver) {
        this.userService = userService;
        this.userResolver = userResolver;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Authentication authentication) {
        UserEntity user = userResolver.resolve(authentication);
        UserDto dto = userService.getUserDtoById(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserEntity user = userResolver.resolve(authentication);
        UserDto updated = userService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
