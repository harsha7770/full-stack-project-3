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
            if (userRepository.count() == 0) {
                // Seed Users
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

                // CAPTURE THE SAVED OBJECTS (This populates the IDs)
                User alice = userRepository.save(aliceObj);
                User bob = userRepository.save(bobObj);
                User admin = userRepository.save(adminObj);
                User charlie = userRepository.save(charlieObj);
                
                System.out.println("Database seeded with sample users. Alice ID: " + alice.getId());

                // Seed Sessions using the NEW IDs
                Session session1 = new Session(null, alice.getId(), charlie.getId(), "React Best Practices", 
                        LocalDateTime.now().plusDays(1), "10:00 AM", "60", "https://zoom.us/j/123", "Virtual", "scheduled", 100, null, null);
                sessionRepository.save(session1);
                
                System.out.println("Database seeded with sample sessions.");
            }
        };
    }
}
