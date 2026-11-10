package com.gramincareersetu.jobs;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.io.Serializable;
import java.time.Instant;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "jobs")
@EntityListeners(AuditingEntityListener.class)
public class JobEntity implements Serializable {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "title_te", nullable = false)
    private String titleTe;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "exam_name")
    private String examName;

    @Column(name = "where_to_apply", length = 512)
    private String whereToApply;

    @Column(name = "salary_range", length = 100)
    private String salaryRange;

    @Column(name = "prep_time", length = 100)
    private String prepTime;

    @Column(name = "free_resource", length = 512)
    private String freeResource;

    @Column(name = "company")
    private String company;

    @Column(name = "location")
    private String location;

    @Column(name = "status", length = 20, nullable = false)
    private String status = "ACTIVE";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    public JobEntity() {}

    public JobEntity(String id, String titleTe, String titleEn, String category, String qualification,
                     String examName, String whereToApply, String salaryRange, String prepTime,
                     String freeResource, String company, String location, String status) {
        this.id = id;
        this.titleTe = titleTe;
        this.titleEn = titleEn;
        this.category = category;
        this.qualification = qualification;
        this.examName = examName;
        this.whereToApply = whereToApply;
        this.salaryRange = salaryRange;
        this.prepTime = prepTime;
        this.freeResource = freeResource;
        this.company = company;
        this.location = location;
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

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public String getWhereToApply() {
        return whereToApply;
    }

    public void setWhereToApply(String whereToApply) {
        this.whereToApply = whereToApply;
    }

    public String getSalaryRange() {
        return salaryRange;
    }

    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }

    public String getPrepTime() {
        return prepTime;
    }

    public void setPrepTime(String prepTime) {
        this.prepTime = prepTime;
    }

    public String getFreeResource() {
        return freeResource;
    }

    public void setFreeResource(String freeResource) {
        this.freeResource = freeResource;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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
