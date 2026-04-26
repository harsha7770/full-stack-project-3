package com.mentorship.backend.dto;

import com.mentorship.backend.model.User;

public class AuthResponse {
    private boolean success;
    private User user;
    private String error;
    private String message;
    
    public AuthResponse() {}

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AuthResponse(boolean success, User user) {
        this.success = success;
        this.user = user;
    }
    
    public AuthResponse(String error) {
        this.success = false;
        this.error = error;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
