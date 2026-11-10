package com.gramincareersetu.jobs;

import com.gramincareersetu.common.BadRequestException;
import com.gramincareersetu.common.PagedResponse;
import com.gramincareersetu.common.ResourceNotFoundException;
import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobService {

    private static final Logger log = LoggerFactory.getLogger(JobService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final JobBookmarkRepository bookmarkRepository;

    @Autowired
    public JobService(
            JobRepository jobRepository,
            JobApplicationRepository applicationRepository,
            JobBookmarkRepository bookmarkRepository
    ) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.bookmarkRepository = bookmarkRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "jobs", key = "(#category ?: 'all') + '_' + (#query ?: '') + '_' + #pageable.pageNumber + '_' + #pageable.pageSize", unless = "#result == null")
    public PagedResponse<JobDto> getJobs(String category, String query, Pageable pageable) {
        Specification<JobEntity> spec = Specification.where((root, q, cb) -> cb.equal(root.get("status"), "ACTIVE"));

        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            spec = spec.and((root, q, cb) -> cb.equal(cb.lower(root.get("category")), category.toLowerCase()));
        }

        if (query != null && !query.isBlank()) {
            String likePattern = "%" + query.toLowerCase().trim() + "%";
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("titleEn")), likePattern),
                    cb.like(cb.lower(root.get("titleTe")), likePattern),
                    cb.like(cb.lower(root.get("qualification")), likePattern),
                    cb.like(cb.lower(root.get("company")), likePattern)
            ));
        }

        Page<JobEntity> page = jobRepository.findAll(spec, pageable);
        List<JobDto> dtoList = page.getContent().stream().map(JobDto::fromEntity).toList();

        return new PagedResponse<>(
                dtoList,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional(readOnly = true)
    public JobDto getJobById(String id) {
        JobEntity entity = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        return JobDto.fromEntity(entity);
    }

    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobDto createJob(CreateJobRequest request) {
        if (jobRepository.existsById(request.id())) {
            throw new BadRequestException("Job with ID '" + request.id() + "' already exists");
        }

        JobEntity entity = new JobEntity(
                request.id(),
                request.titleTe(),
                request.titleEn(),
                request.category().toLowerCase(),
                request.qualification(),
                request.examName(),
                request.whereToApply(),
                request.salaryRange(),
                request.prepTime(),
                request.freeResource(),
                request.company() != null ? request.company() : "Gramin Opportunities",
                request.location() != null ? request.location() : "Andhra Pradesh",
                request.status() != null ? request.status() : "ACTIVE"
        );

        JobEntity saved = jobRepository.save(entity);
        log.info("Created job posting with id: {}", saved.getId());
        return JobDto.fromEntity(saved);
    }

    @Transactional
    public JobApplicationDto applyForJob(String jobId, ApplyJobRequest request, UUID userId) {
        JobEntity job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!"ACTIVE".equalsIgnoreCase(job.getStatus())) {
            throw new BadRequestException("This job posting is no longer active for applications");
        }

        if (applicationRepository.existsByJobIdAndPhone(jobId, request.phone())) {
            throw new BadRequestException("An application has already been submitted for this phone number and job");
        }

        String appId;
        int attempts = 0;
        do {
            appId = String.format("APP-%d-%04d", System.currentTimeMillis() % 1_000_000_000L, RANDOM.nextInt(10000));
            attempts++;
            if (attempts > 5) {
                appId = "APP-" + UUID.randomUUID().toString().substring(0, 13).toUpperCase();
                break;
            }
        } while (applicationRepository.existsById(appId));
        JobApplicationEntity application = new JobApplicationEntity(
                appId,
                job.getId(),
                request.applicantName().trim(),
                request.phone().trim(),
                request.village().trim(),
                userId
        );

        JobApplicationEntity saved = applicationRepository.save(application);
        log.info("Registered job application {} for job {}", saved.getId(), jobId);
        return JobApplicationDto.fromEntity(saved);
    }

    @Transactional
    public boolean toggleBookmark(String jobId, UUID userId) {
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job", "id", jobId);
        }

        if (bookmarkRepository.existsByUserIdAndJobId(userId, jobId)) {
            bookmarkRepository.deleteByUserIdAndJobId(userId, jobId);
            return false;
        } else {
            JobBookmarkEntity bookmark = new JobBookmarkEntity(userId, jobId);
            bookmarkRepository.save(bookmark);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public boolean isBookmarked(String jobId, UUID userId) {
        return bookmarkRepository.existsByUserIdAndJobId(userId, jobId);
    }

    @Transactional(readOnly = true)
    public List<JobDto> getUserBookmarks(UUID userId) {
        List<JobBookmarkEntity> bookmarks = bookmarkRepository.findByUserId(userId);
        List<String> jobIds = bookmarks.stream().map(JobBookmarkEntity::getJobId).toList();
        return jobRepository.findAllById(jobIds).stream().map(JobDto::fromEntity).toList();
    }
}
