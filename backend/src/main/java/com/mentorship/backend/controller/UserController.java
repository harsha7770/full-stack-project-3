package com.mentorship.backend.controller;

import com.mentorship.backend.model.User;
import com.mentorship.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/mentors")
    public List<User> getMentors() {
        return userRepository.findByRole("mentor");
    }

    @GetMapping("/mentees")
    public List<User> getMentees() {
        return userRepository.findByRole("mentee");
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Integer id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setBio(userDetails.getBio());
            if (userDetails.getExpertise() != null) user.setExpertise(userDetails.getExpertise());
            if (userDetails.getInterests() != null) user.setInterests(userDetails.getInterests());
            if (userDetails.getExperience() != null) user.setExperience(userDetails.getExperience());
            if (userDetails.getHourlyRate() != null) user.setHourlyRate(userDetails.getHourlyRate());
            
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build());
    }
}
