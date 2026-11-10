package com.gramincareersetu.schemes;

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
@Table(name = "government_schemes")
@EntityListeners(AuditingEntityListener.class)
public class GovernmentSchemeEntity implements Serializable {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "title_te", nullable = false)
    private String titleTe;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "ministry")
    private String ministry;

    @Column(name = "benefit")
    private String benefit;

    @Column(name = "eligibility")
    private String eligibility;

    @Column(name = "application_url", length = 512)
    private String applicationUrl;

    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "status", length = 20, nullable = false)
    private String status = "ACTIVE";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public GovernmentSchemeEntity() {}

    public GovernmentSchemeEntity(String id, String titleTe, String titleEn, String ministry,
                                  String benefit, String eligibility, String applicationUrl,
                                  String category, String status) {
        this.id = id;
        this.titleTe = titleTe;
        this.titleEn = titleEn;
        this.ministry = ministry;
        this.benefit = benefit;
        this.eligibility = eligibility;
        this.applicationUrl = applicationUrl;
        this.category = category;
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

    public String getMinistry() {
        return ministry;
    }

    public void setMinistry(String ministry) {
        this.ministry = ministry;
    }

    public String getBenefit() {
        return benefit;
    }

    public void setBenefit(String benefit) {
        this.benefit = benefit;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getApplicationUrl() {
        return applicationUrl;
    }

    public void setApplicationUrl(String applicationUrl) {
        this.applicationUrl = applicationUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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
