package com.mentorship.backend.model;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Progress")
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "menteeId", nullable = false)
    private Integer menteeId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime date;

    public Progress() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getMenteeId() { return menteeId; }
    public void setMenteeId(Integer menteeId) { this.menteeId = menteeId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getDate() { return date; }
}
