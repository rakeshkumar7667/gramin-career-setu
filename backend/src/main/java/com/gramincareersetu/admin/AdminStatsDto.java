package com.gramincareersetu.admin;

import com.gramincareersetu.jobs.JobApplicationDto;
import java.util.List;

public record AdminStatsDto(
        long totalUsers,
        long totalJobs,
        long totalApplications,
        long totalWorkshops,
        long totalResumes,
        List<JobApplicationDto> recentApplications
) {}
