package com.gramincareersetu.quiz;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttemptEntity, UUID> {

    List<QuizAttemptEntity> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
