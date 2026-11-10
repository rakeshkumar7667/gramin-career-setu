package com.gramincareersetu.admin;

import com.gramincareersetu.audit.AuditLogEntity;
import com.gramincareersetu.audit.AuditLogRepository;
import com.gramincareersetu.audit.AuditService;
import com.gramincareersetu.common.PagedResponse;
import com.gramincareersetu.common.ResourceNotFoundException;
import com.gramincareersetu.jobs.JobApplicationDto;
import com.gramincareersetu.jobs.JobApplicationEntity;
import com.gramincareersetu.jobs.JobApplicationRepository;
import com.gramincareersetu.jobs.JobRepository;
import com.gramincareersetu.resumes.ResumeRepository;
import com.gramincareersetu.users.UserRepository;
import com.gramincareersetu.workshops.WorkshopRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final WorkshopRepository workshopRepository;
    private final ResumeRepository resumeRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditService auditService;

    @Autowired
    public AdminService(
            UserRepository userRepository,
            JobRepository jobRepository,
            JobApplicationRepository applicationRepository,
            WorkshopRepository workshopRepository,
            ResumeRepository resumeRepository,
            AuditLogRepository auditLogRepository,
            AuditService auditService
    ) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.workshopRepository = workshopRepository;
        this.resumeRepository = resumeRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getStats() {
        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        long totalWorkshops = workshopRepository.count();
        long totalResumes = resumeRepository.count();

        Pageable topFive = PageRequest.of(0, 5, Sort.by("createdAt").descending());
        List<JobApplicationDto> recent = applicationRepository.findAll(topFive)
                .getContent()
                .stream()
                .map(JobApplicationDto::fromEntity)
                .toList();

        return new AdminStatsDto(
                totalUsers,
                totalJobs,
                totalApplications,
                totalWorkshops,
                totalResumes,
                recent
        );
    }

    @Transactional(readOnly = true)
    public PagedResponse<JobApplicationDto> getApplications(String status, Pageable pageable) {
        Page<JobApplicationEntity> page;
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            page = applicationRepository.findByStatus(status.trim().toUpperCase(), pageable);
        } else {
            page = applicationRepository.findAll(pageable);
        }

        List<JobApplicationDto> list = page.getContent().stream()
                .map(JobApplicationDto::fromEntity)
                .toList();

        return new PagedResponse<>(
                list,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional
    public JobApplicationDto updateApplicationStatus(String applicationId, UpdateApplicationStatusRequest request, String actor) {
        JobApplicationEntity application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", applicationId));

        String oldStatus = application.getStatus();
        application.setStatus(request.status());
        JobApplicationEntity saved = applicationRepository.save(application);

        auditService.record(
                actor,
                actor,
                "UPDATE_STATUS",
                "JobApplication",
                applicationId,
                String.format("Status changed from %s to %s. Note: %s", oldStatus, request.status(), request.note() != null ? request.note() : "")
        );

        log.info("Admin {} updated application {} status to {}", actor, applicationId, request.status());
        return JobApplicationDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<AuditLogEntity> getAuditLogs(Pageable pageable) {
        Page<AuditLogEntity> page = auditLogRepository.findByOrderByCreatedAtDesc(pageable);
        return PagedResponse.from(page);
    }
}
