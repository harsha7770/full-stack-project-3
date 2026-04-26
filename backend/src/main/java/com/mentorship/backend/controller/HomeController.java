package com.mentorship.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Online");
        response.put("message", "Mentorship Platform API is running successfully.");
        response.put("version", "1.0.0");
        response.put("documentation", "Use /mentors to see the list of mentors");
        return response;
    }
}
