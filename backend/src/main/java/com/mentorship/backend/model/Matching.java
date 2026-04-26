package com.mentorship.backend.model;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Matchings")
public class Matching {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "mentorId", nullable = false)
    private Integer mentorId;

    @Column(name = "menteeId", nullable = false)
    private Integer menteeId;

    private String status = "active";

    @CreationTimestamp
    @Column(name = "startDate", updatable = false)
    private LocalDateTime startDate;

    public Matching() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getMentorId() { return mentorId; }
    public void setMentorId(Integer mentorId) { this.mentorId = mentorId; }
    public Integer getMenteeId() { return menteeId; }
    public void setMenteeId(Integer menteeId) { this.menteeId = menteeId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getStartDate() { return startDate; }
}
