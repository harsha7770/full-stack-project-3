package com.mentorship.backend.model;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "mentorId", nullable = false)
    private Integer mentorId;

    @Column(name = "menteeId", nullable = false)
    private Integer menteeId;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime date;

    private String time;
    private String duration;
    @Column(name = "meetingLink")
    private String meetingLink;
    private String mode;
    private String status = "scheduled";
    @Column(name = "estimatedCost")
    private Integer estimatedCost = 0;

    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    // Constructors
    public Session() {}

    public Session(Integer id, Integer mentorId, Integer menteeId, String topic, LocalDateTime date, String time, String duration, String meetingLink, String mode, String status, Integer estimatedCost, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.mentorId = mentorId;
        this.menteeId = menteeId;
        this.topic = topic;
        this.date = date;
        this.time = time;
        this.duration = duration;
        this.meetingLink = meetingLink;
        this.mode = mode;
        this.status = status;
        this.estimatedCost = estimatedCost;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getMentorId() { return mentorId; }
    public void setMentorId(Integer mentorId) { this.mentorId = mentorId; }
    public Integer getMenteeId() { return menteeId; }
    public void setMenteeId(Integer menteeId) { this.menteeId = menteeId; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Integer estimatedCost) { this.estimatedCost = estimatedCost; }
}
