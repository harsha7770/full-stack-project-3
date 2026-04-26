package com.mentorship.backend.model;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(nullable = false)
    private String role; // 'admin', 'mentor', 'mentee'

    @Column(columnDefinition = "JSON")
    @JsonIgnore
    private String expertise;

    @Column(columnDefinition = "JSON")
    @JsonIgnore
    private String interests;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private Integer experience = 0;

    @Column(name = "hourlyRate")
    private Integer hourlyRate = 0;

    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    // Constructors
    public User() {}

    public User(Integer id, String name, String email, String password, String role, String expertise, String interests, String bio, Integer experience, Integer hourlyRate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.expertise = expertise;
        this.interests = interests;
        this.bio = bio;
        this.experience = experience;
        this.hourlyRate = hourlyRate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getExpertise() { return expertise; }
    public String getInterests() { return interests; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }
    public Integer getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Integer hourlyRate) { this.hourlyRate = hourlyRate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    @JsonProperty("expertise")
    public List<String> getExpertiseList() {
        return parseJsonList(this.expertise);
    }

    @JsonProperty("interests")
    public List<String> getInterestsList() {
        return parseJsonList(this.interests);
    }

    public void setExpertise(Object value) {
        if (value instanceof String) {
            this.expertise = (String) value;
        } else {
            try {
                this.expertise = new ObjectMapper().writeValueAsString(value);
            } catch (Exception e) {
                this.expertise = "[]";
            }
        }
    }

    public void setInterests(Object value) {
        if (value instanceof String) {
            this.interests = (String) value;
        } else {
            try {
                this.interests = new ObjectMapper().writeValueAsString(value);
            } catch (Exception e) {
                this.interests = "[]";
            }
        }
    }

    private List<String> parseJsonList(String json) {
        if (json == null || json.isEmpty()) return new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(json, new TypeReference<List<String>>(){});
        } catch (Exception e) {
            List<String> list = new ArrayList<>();
            if (json != null && json.startsWith("[") && json.endsWith("]")) {
                String content = json.substring(1, json.length() - 1);
                for (String part : content.split(",")) {
                    list.add(part.trim().replace("\"", ""));
                }
            } else if (json != null) {
                list.add(json);
            }
            return list;
        }
    }
}
