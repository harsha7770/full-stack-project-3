package com.mentorship.backend.config;

import com.mentorship.backend.model.User;
import com.mentorship.backend.model.Session;
import com.mentorship.backend.repository.UserRepository;
import com.mentorship.backend.repository.SessionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, 
                                 SessionRepository sessionRepository) {
        return args -> {
            // Seed Additional Mentors
            seedMentor(userRepository, "Emily Chen", "emily@example.com", "[\"Cybersecurity\", \"Cloud Security\"]", "Helping protect modern cloud infrastructures.", 8, 90);
            seedMentor(userRepository, "Michael Brown", "michael@example.com", "[\"Cloud Architecture\", \"AWS\"]", "AWS certified architect with a focus on scalability.", 12, 120);
            seedMentor(userRepository, "Sarah Davis", "sarah@example.com", "[\"UI/UX Design\", \"Figma\"]", "Designing intuitive and beautiful user journeys.", 6, 85);
            seedMentor(userRepository, "James Wilson", "james@example.com", "[\"Mobile Development\", \"Flutter\"]", "Cross-platform mobile developer.", 5, 80);
            seedMentor(userRepository, "Jessica Taylor", "jessica@example.com", "[\"Career Coaching\", \"Interviews\"]", "Helping you land your dream tech job.", 15, 150);

            if (userRepository.count() <= 4) { // Basic set + Admin/Charlie
                User aliceObj = new User(null, "Alice Smith", "alice@example.com", "password123", "mentor", 
                        null, null, "Senior Engineer with 10 years experience.", 10, 100, null, null);
                aliceObj.setExpertise("[\"Web Development\", \"React\", \"Node.js\"]");
                
                User bobObj = new User(null, "Bob Johnson", "bob@example.com", "password123", "mentor", 
                        null, null, "Data Scientist passionate about AI.", 5, 75, null, null);
                bobObj.setExpertise("[\"Data Science\", \"Python\", \"Machine Learning\"]");
                
                User adminObj = new User(null, "System Admin", "admin@example.com", "admin", "admin", 
                        null, null, "Platform Administrator.", 0, 0, null, null);
                
                User charlieObj = new User(null, "Charlie Williams", "charlie@example.com", "password123", "mentee", 
                        null, null, "Just joined the platform!", 0, 0, null, null);
                charlieObj.setInterests("[\"Web Development\", \"UI/UX\"]");

                User alice = userRepository.save(aliceObj);
                User bob = userRepository.save(bobObj);
                userRepository.save(adminObj);
                User charlie = userRepository.save(charlieObj);
                
                Session session1 = new Session(null, alice.getId(), charlie.getId(), "React Best Practices", 
                        LocalDateTime.now().plusDays(1), "10:00 AM", "60", "https://zoom.us/j/123", "Virtual", "scheduled", 100, null, null);
                sessionRepository.save(session1);
            }
        };
    }

    private void seedMentor(UserRepository repo, String name, String email, String expertise, String bio, int exp, int rate) {
        if (!repo.findByEmail(email).isPresent()) {
            User mentor = new User(null, name, email, "password123", "mentor", null, null, bio, exp, rate, null, null);
            mentor.setExpertise(expertise);
            repo.save(mentor);
            System.out.println("Seeded mentor: " + name);
        }
    }
}
