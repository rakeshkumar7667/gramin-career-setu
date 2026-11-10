package com.gramincareersetu.schemes;

import com.gramincareersetu.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    @Transactional(readOnly = true)
    public List<GovernmentSchemeDto> getAllActiveSchemes() {
        return schemeRepository.findByStatusOrderByCreatedAtAsc("ACTIVE").stream()
                .map(GovernmentSchemeDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<GovernmentSchemeDto> getSchemes(String category, Pageable pageable) {
        Page<GovernmentSchemeEntity> page;
        if (category != null && !category.isBlank()) {
            page = schemeRepository.findByCategoryAndStatus(category, "ACTIVE", pageable);
        } else {
            page = schemeRepository.findByStatus("ACTIVE", pageable);
        }
        return page.map(GovernmentSchemeDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public GovernmentSchemeDto getSchemeById(String id) {
        return schemeRepository.findById(id)
                .map(GovernmentSchemeDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Government scheme not found with id: " + id));
    }
}
