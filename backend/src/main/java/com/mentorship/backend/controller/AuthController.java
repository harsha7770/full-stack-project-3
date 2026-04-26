package com.mentorship.backend.controller;

import com.mentorship.backend.dto.AuthResponse;
import com.mentorship.backend.dto.LoginRequest;
import com.mentorship.backend.model.User;
import com.mentorship.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userRepository.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword());
        if (user.isPresent()) {
            return ResponseEntity.ok(new AuthResponse(true, user.get()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Invalid credentials. Please double check your email and password."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        if (user.getName() == null || user.getEmail() == null || user.getPassword() == null || user.getRole() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse("All fields are required"));
        }

        if (user.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(new AuthResponse("Password must be at least 6 characters long."));
        }

        if (user.getRole().equals("mentor")) {
            user.setExpertise("[\"Leadership\", \"General Tech\"]");
        } else if (user.getRole().equals("mentee")) {
            user.setInterests("[\"Professional Growth\"]");
        }
        user.setBio("Just joined the platform!");

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(new AuthResponse("Email already exists"));
        }

        User newUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(true, newUser));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> user = userRepository.findByEmail(email);
        
        if (user.isPresent()) {
            // In a real app, you would generate a token and send a real email.
            // For this demo, we simulate it.
            System.out.println(">>> PASSWORD RESET REQUEST FOR: " + email);
            System.out.println(">>> RESET LINK: http://localhost:5174/reset-password?email=" + email);
            
            return ResponseEntity.ok(new AuthResponse(true, "A password reset link has been sent to your email."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AuthResponse("No account found with this email address."));
        }
    }
}
