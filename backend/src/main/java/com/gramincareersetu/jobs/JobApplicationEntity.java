package com.gramincareersetu.jobs;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "job_applications")
@EntityListeners(AuditingEntityListener.class)
public class JobApplicationEntity implements Serializable {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "job_id", length = 64, nullable = false)
    private String jobId;

    @Column(name = "applicant_name", nullable = false)
    private String applicantName;

    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @Column(name = "village", nullable = false)
    private String village;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "status", length = 30, nullable = false)
    private String status = "SUBMITTED";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    public JobApplicationEntity() {}

    public JobApplicationEntity(String id, String jobId, String applicantName, String phone, String village, UUID userId) {
        this.id = id;
        this.jobId = jobId;
        this.applicantName = applicantName;
        this.phone = phone;
        this.village = village;
        this.userId = userId;
        this.status = "SUBMITTED";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
