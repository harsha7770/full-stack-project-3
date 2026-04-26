package com.mentorship.backend.controller;

import com.mentorship.backend.model.Progress;
import com.mentorship.backend.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/progress")
public class ProgressController {

    @Autowired
    private ProgressRepository progressRepository;

    @GetMapping
    public List<Progress> getProgress(@RequestParam(required = false) Integer menteeId) {
        if (menteeId != null) {
            return progressRepository.findByMenteeId(menteeId);
        }
        return progressRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createProgress(@RequestBody Progress progress) {
        if (progress.getMenteeId() == null || progress.getDescription() == null) {
            java.util.Map<String, String> errorMap = new java.util.HashMap<>();
            errorMap.put("error", "menteeId and description are required");
            return ResponseEntity.badRequest().body(errorMap);
        }

        Progress savedProgress = progressRepository.save(progress);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProgress);
    }
}
