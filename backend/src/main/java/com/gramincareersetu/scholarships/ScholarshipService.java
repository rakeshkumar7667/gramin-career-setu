package com.gramincareersetu.scholarships;

import com.gramincareersetu.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;

    public ScholarshipService(ScholarshipRepository scholarshipRepository) {
        this.scholarshipRepository = scholarshipRepository;
    }

    @Transactional(readOnly = true)
    public List<ScholarshipDto> getAllActiveScholarships() {
        return scholarshipRepository.findByStatusOrderByCreatedAtAsc("ACTIVE").stream()
                .map(ScholarshipDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<ScholarshipDto> getScholarships(String category, Pageable pageable) {
        Page<ScholarshipEntity> page;
        if (category != null && !category.isBlank()) {
            page = scholarshipRepository.findByCategoryAndStatus(category, "ACTIVE", pageable);
        } else {
            page = scholarshipRepository.findByStatus("ACTIVE", pageable);
        }
        return page.map(ScholarshipDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public ScholarshipDto getScholarshipById(String id) {
        return scholarshipRepository.findById(id)
                .map(ScholarshipDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with id: " + id));
    }
}
