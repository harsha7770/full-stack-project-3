package com.mentorship.backend.controller;

import com.mentorship.backend.model.Session;
import com.mentorship.backend.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sessions")
public class SessionController {

    @Autowired
    private SessionRepository sessionRepository;

    @GetMapping
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("Received Session Request: " + payload);
            
            Session session = new Session();
            session.setTopic((String) payload.get("topic"));
            
            // Safe ID Parsing
            Object mentorIdObj = payload.get("mentorId");
            Object menteeIdObj = payload.get("menteeId");
            if (mentorIdObj != null) session.setMentorId(Integer.valueOf(mentorIdObj.toString()));
            if (menteeIdObj != null) session.setMenteeId(Integer.valueOf(menteeIdObj.toString()));
            
            // Date Parsing
            if (payload.get("date") != null) {
                String dateStr = (String) payload.get("date");
                if (dateStr.contains("-") && dateStr.indexOf("-") < 4) {
                    // Handle DD-MM-YYYY -> YYYY-MM-DD
                    String[] parts = dateStr.split("-");
                    dateStr = parts[2] + "-" + parts[1] + "-" + parts[0];
                }
                
                try {
                    session.setDate(java.time.LocalDateTime.parse(dateStr));
                } catch (Exception e) {
                    // Fallback for different formats (adding time if only date provided)
                    if (dateStr.length() == 10) dateStr += "T12:00:00"; 
                    else if (dateStr.length() == 16) dateStr += ":00";
                    session.setDate(java.time.LocalDateTime.parse(dateStr.replace(" ", "T")));
                }
            }
            
            session.setTime((String) payload.get("time"));
            session.setDuration((String) payload.get("duration"));
            
            // Set a default meeting link if none provided
            String meetingLink = (String) payload.get("meetingLink");
            if (meetingLink == null || meetingLink.isEmpty()) {
                meetingLink = "https://meet.google.com/new";
            }
            session.setMeetingLink(meetingLink);
            session.setMode(payload.get("mode") != null ? (String) payload.get("mode") : "Virtual");

            if (session.getMentorId() == null || session.getMenteeId() == null || 
                session.getTopic() == null || session.getDate() == null) {
                return ResponseEntity.badRequest().body("Required fields missing");
            }

            session.setStatus("scheduled");
            Session savedSession = sessionRepository.save(session);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSession);
            
        } catch (Exception e) {
            System.err.println("Booking Error: " + e.getMessage());
            e.printStackTrace();
            java.util.Map<String, String> errorMap = new java.util.HashMap<>();
            errorMap.put("error", "Database Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMap);
        }
    }
}
