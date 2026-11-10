package com.gramincareersetu.workshops;

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
@Table(name = "workshops")
@EntityListeners(AuditingEntityListener.class)
public class WorkshopEntity implements Serializable {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "title_te")
    private String titleTe;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "speaker")
    private String speaker;

    @Column(name = "event_date")
    private Instant eventDate;

    @Column(name = "capacity", nullable = false)
    private int capacity = 100;

    @Column(name = "status", length = 20, nullable = false)
    private String status = "UPCOMING";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    public WorkshopEntity() {}

    public WorkshopEntity(String id, String titleTe, String titleEn, String category, String speaker, Instant eventDate, int capacity) {
        this.id = id;
        this.titleTe = titleTe;
        this.titleEn = titleEn;
        this.category = category;
        this.speaker = speaker;
        this.eventDate = eventDate;
        this.capacity = capacity;
        this.status = "UPCOMING";
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

    public String getSpeaker() {
        return speaker;
    }

    public void setSpeaker(String speaker) {
        this.speaker = speaker;
    }

    public Instant getEventDate() {
        return eventDate;
    }

    public void setEventDate(Instant eventDate) {
        this.eventDate = eventDate;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
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
