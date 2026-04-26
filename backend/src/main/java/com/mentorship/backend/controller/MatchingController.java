package com.mentorship.backend.controller;

import com.mentorship.backend.model.Matching;
import com.mentorship.backend.model.Session;
import com.mentorship.backend.model.User;
import com.mentorship.backend.repository.MatchingRepository;
import com.mentorship.backend.repository.SessionRepository;
import com.mentorship.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/match")
public class MatchingController {

    @Autowired
    private MatchingRepository matchingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @GetMapping
    public List<Matching> getAllMatchings() {
        return matchingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createMatching(@RequestBody Map<String, Object> payload) {
        Object mentorIdObj = payload.get("mentorId");
        Object menteeIdObj = payload.get("menteeId");

        Integer mentorId = null;
        Integer menteeId = null;

        if (mentorIdObj != null) mentorId = Integer.valueOf(mentorIdObj.toString());
        if (menteeIdObj != null) menteeId = Integer.valueOf(menteeIdObj.toString());

        if (mentorId == null || menteeId == null) {
            java.util.Map<String, String> errorMap = new java.util.HashMap<>();
            errorMap.put("error", "mentorId and menteeId are required");
            return ResponseEntity.badRequest().body(errorMap);
        }

        Optional<User> mentor = userRepository.findById(mentorId);
        Optional<User> mentee = userRepository.findById(menteeId);

        if (!mentor.isPresent() || !mentor.get().getRole().equals("mentor") || 
            !mentee.isPresent() || !mentee.get().getRole().equals("mentee")) {
            java.util.Map<String, String> errorMap = new java.util.HashMap<>();
            errorMap.put("error", "Valid mentor or mentee not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMap);
        }

        Optional<Matching> existingMatch = matchingRepository.findByMentorIdAndMenteeId(mentorId, menteeId);
        if (existingMatch.isPresent()) {
            java.util.Map<String, String> errorMap = new java.util.HashMap<>();
            errorMap.put("error", "Mentors are already matched");
            return ResponseEntity.badRequest().body(errorMap);
        }

        Matching newMatch = new Matching();
        newMatch.setMentorId(mentorId);
        newMatch.setMenteeId(menteeId);
        newMatch.setStatus("active");
        Matching savedMatch = matchingRepository.save(newMatch);

        if (payload.containsKey("topic") && payload.get("date") != null) {
            try {
                Session session = new Session();
                session.setMentorId(mentorId);
                session.setMenteeId(menteeId);
                session.setTopic((String) payload.get("topic"));
                
                String dateStr = (String) payload.get("date"); // e.g. "2026-04-12" or "12-04-2026"
                String timeStr = (String) payload.get("time"); // e.g. "18:30"
                
                if (dateStr != null) {
                    // Normalize date format
                    if (dateStr.contains("-") && dateStr.indexOf("-") < 4) {
                        // Handle DD-MM-YYYY -> YYYY-MM-DD
                        String[] parts = dateStr.split("-");
                        dateStr = parts[2] + "-" + parts[1] + "-" + parts[0];
                    }
                    
                    if (timeStr == null || !timeStr.contains(":")) timeStr = "12:00";
                    session.setDate(LocalDateTime.parse(dateStr + "T" + timeStr + ":00"));
                    session.setTime(timeStr);
                }

                session.setDuration(payload.get("duration") != null ? payload.get("duration").toString() : "30");
                
                String meetingLink = (String) payload.get("meetingLink");
                if (meetingLink == null || meetingLink.isEmpty()) {
                    meetingLink = "https://meet.google.com/new";
                }
                session.setMeetingLink(meetingLink);
                session.setMode(payload.get("mode") != null ? (String) payload.get("mode") : "Virtual");
                
                Object costObj = payload.get("estimatedCost");
                if (costObj != null) session.setEstimatedCost(Integer.valueOf(costObj.toString()));
                
                session.setStatus("scheduled");
                sessionRepository.save(session);
                System.out.println(">>> Connection & Session Successful!");
            } catch (Exception e) {
                System.err.println(">>> Error during session creation: " + e.getMessage());
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedMatch);
    }
}
