package com.gramincareersetu.workshops;

import com.gramincareersetu.auth.AuthenticatedUserResolver;
import com.gramincareersetu.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/workshops")
public class WorkshopController {

    private final WorkshopService workshopService;
    private final AuthenticatedUserResolver userResolver;

    @Autowired
    public WorkshopController(WorkshopService workshopService, AuthenticatedUserResolver userResolver) {
        this.workshopService = workshopService;
        this.userResolver = userResolver;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkshopDto>>> getUpcomingWorkshops() {
        List<WorkshopDto> workshops = workshopService.getUpcomingWorkshops();
        return ResponseEntity.ok(ApiResponse.ok(workshops));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<WorkshopRegistrationEntity>> registerForWorkshop(
            @PathVariable String id,
            @RequestHeader(value = "Idempotency-Key", required = false) String headerIdempotencyKey,
            @Valid @RequestBody RegisterWorkshopRequest request,
            Authentication authentication
    ) {
        UUID userId = userResolver.resolveUserId(authentication).orElse(null);

        String effectiveKey = (headerIdempotencyKey != null && !headerIdempotencyKey.isBlank())
                ? headerIdempotencyKey
                : request.idempotencyKey();

        RegisterWorkshopRequest resolvedRequest = new RegisterWorkshopRequest(request.name(), request.phone(), effectiveKey);
        WorkshopRegistrationEntity registration = workshopService.registerForWorkshop(id, resolvedRequest, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Workshop registration confirmed successfully", registration));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelWorkshop(
            @PathVariable String id,
            @Valid @RequestBody CancelWorkshopRequest request,
            Authentication authentication
    ) {
        UUID userId = userResolver.resolveUserId(authentication).orElse(null);
        boolean isAdmin = userResolver.isAdmin(authentication);
        workshopService.cancelRegistration(id, request, userId, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Workshop registration cancelled successfully", null));
    }
}
