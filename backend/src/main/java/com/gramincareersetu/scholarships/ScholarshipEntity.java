package com.gramincareersetu.scholarships;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.Instant;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "scholarships")
@EntityListeners(AuditingEntityListener.class)
public class ScholarshipEntity implements Serializable {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "title_te", nullable = false)
    private String titleTe;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "eligibility")
    private String eligibility;

    @Column(name = "amount_range", length = 100)
    private String amountRange;

    @Column(name = "deadline", length = 100)
    private String deadline;

    @Column(name = "portal_url", length = 512)
    private String portalUrl;

    @Column(name = "status", length = 20, nullable = false)
    private String status = "ACTIVE";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ScholarshipEntity() {}

    public ScholarshipEntity(String id, String titleTe, String titleEn, String category,
                             String eligibility, String amountRange, String deadline,
                             String portalUrl, String status) {
        this.id = id;
        this.titleTe = titleTe;
        this.titleEn = titleEn;
        this.category = category;
        this.eligibility = eligibility;
        this.amountRange = amountRange;
        this.deadline = deadline;
        this.portalUrl = portalUrl;
        this.status = status != null ? status : "ACTIVE";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitleTe() {
        return titleTe;
    }

    public void setTitleTe(String titleTe) {
        this.titleTe = titleTe;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getAmountRange() {
        return amountRange;
    }

    public void setAmountRange(String amountRange) {
        this.amountRange = amountRange;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getPortalUrl() {
        return portalUrl;
    }

    public void setPortalUrl(String portalUrl) {
        this.portalUrl = portalUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
