package com.gramincareersetu.quiz;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "quiz_attempts")
@EntityListeners(AuditingEntityListener.class)
public class QuizAttemptEntity implements Serializable {

    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "technical_score", nullable = false)
    private int technicalScore;

    @Column(name = "government_score", nullable = false)
    private int governmentScore;

    @Column(name = "business_score", nullable = false)
    private int businessScore;

    @Column(name = "vocational_score", nullable = false)
    private int vocationalScore;

    @Column(name = "recommended_track", length = 50, nullable = false)
    private String recommendedTrack;

    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public QuizAttemptEntity() {}

    public QuizAttemptEntity(UUID userId, int technicalScore, int governmentScore, int businessScore, int vocationalScore, String recommendedTrack, String answersJson) {
        this.userId = userId;
        this.technicalScore = technicalScore;
        this.governmentScore = governmentScore;
        this.businessScore = businessScore;
        this.vocationalScore = vocationalScore;
        this.recommendedTrack = recommendedTrack;
        this.answersJson = answersJson;
    }

    @PrePersist
    protected void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public int getTechnicalScore() {
        return technicalScore;
    }

    public void setTechnicalScore(int technicalScore) {
        this.technicalScore = technicalScore;
    }

    public int getGovernmentScore() {
        return governmentScore;
    }

    public void setGovernmentScore(int governmentScore) {
        this.governmentScore = governmentScore;
    }

    public int getBusinessScore() {
        return businessScore;
    }

    public void setBusinessScore(int businessScore) {
        this.businessScore = businessScore;
    }

    public int getVocationalScore() {
        return vocationalScore;
    }

    public void setVocationalScore(int vocationalScore) {
        this.vocationalScore = vocationalScore;
    }

    public String getRecommendedTrack() {
        return recommendedTrack;
    }

    public void setRecommendedTrack(String recommendedTrack) {
        this.recommendedTrack = recommendedTrack;
    }

    public String getAnswersJson() {
        return answersJson;
    }

    public void setAnswersJson(String answersJson) {
        this.answersJson = answersJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
