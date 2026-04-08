-- MySQL Database Setup for Mentorship Platform (COMPREHENSIVE)
SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS mentorship_db;
USE mentorship_db;

-- 1. Reset everything
DROP TABLE IF EXISTS Progress;
DROP TABLE IF EXISTS Matchings;
DROP TABLE IF EXISTS Sessions;
DROP TABLE IF EXISTS Users;

-- 2. Create Tables
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'mentor', 'mentee') NOT NULL,
    expertise JSON DEFAULT NULL,
    interests JSON DEFAULT NULL,
    bio TEXT,
    experience INT DEFAULT 0,
    hourlyRate INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentorId INT NOT NULL,
    menteeId INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    time VARCHAR(50),
    duration VARCHAR(50),
    meetingLink VARCHAR(255),
    mode VARCHAR(50),
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    estimatedCost INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentorId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (menteeId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Matchings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentorId INT NOT NULL,
    menteeId INT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentorId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (menteeId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menteeId INT NOT NULL,
    description TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (menteeId) REFERENCES Users(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

-- 3. Insert Users
INSERT INTO Users (id, name, email, password, role, expertise, interests, bio, experience, hourlyRate) VALUES
(1, 'Alice Smith', 'alice@example.com', 'password123', 'mentor', '["Web Development", "React", "Node.js"]', '[]', 'Senior Engineer with 10 years experience.', 10, 100),
(2, 'Bob Johnson', 'bob@example.com', 'password123', 'mentor', '["Data Science", "Python", "Machine Learning"]', '[]', 'Data Scientist passionate about AI.', 5, 75),
(3, 'Charlie Williams', 'charlie@example.com', 'password123', 'mentee', '[]', '["Web Development", "UI/UX"]', 'Goal: Become a full-stack developer.', 0, 0),
(4, 'Diana Prince', 'diana@example.com', 'password123', 'mentee', '[]', '["Data Science", "SQL"]', 'Goal: Transition to a data analysis role.', 0, 0),
(5, 'System Admin', 'admin@example.com', 'admin', 'admin', '[]', '[]', 'Platform Administrator.', 0, 0),
(6, 'Emily Chen', 'emily@example.com', 'password123', 'mentor', '["Cybersecurity", "Cloud Security"]', '[]', 'Helping protect modern cloud infrastructures.', 8, 90),
(7, 'Michael Brown', 'michael@example.com', 'password123', 'mentor', '["Cloud Architecture", "AWS"]', '[]', 'AWS certified architect with a focus on scalability.', 12, 120),
(8, 'Sarah Davis', 'sarah@example.com', 'password123', 'mentor', '["UI/UX Design", "Figma"]', '[]', 'Designing intuitive and beautiful user journeys.', 6, 85),
(9, 'James Wilson', 'james@example.com', 'password123', 'mentor', '["Mobile Development", "Flutter"]', '[]', 'Cross-platform mobile developer.', 5, 80),
(10, 'Jessica Taylor', 'jessica@example.com', 'password123', 'mentor', '["Career Coaching", "Interviews"]', '[]', 'Helping you land your dream tech job.', 15, 150),
(11, 'David Anderson', 'david@example.com', 'password123', 'mentor', '["Frontend Engineering", "Vue.js"]', '[]', 'Focused on creating performant web applications.', 7, 95),
(12, 'Linda Martinez', 'linda@example.com', 'password123', 'mentor', '["Backend Systems", "Go"]', '[]', 'Building reliable and scalable backend services.', 9, 110),
(13, 'Robert Thomas', 'robert@example.com', 'password123', 'mentor', '["Product Management", "Strategy"]', '[]', 'Bridging the gap between business and technology.', 11, 140),
(14, 'Patricia Garcia', 'patricia@example.com', 'password123', 'mentor', '["Data Analytics", "Tableau"]', '[]', 'Turning complex data into actionable insights.', 10, 100),
(15, 'Richard Moore', 'richard@example.com', 'password123', 'mentor', '["Technical Writing", "Documentation"]', '[]', 'Making technical concepts simple and clear.', 8, 70),
(16, 'Barbara Miller', 'barbara@example.com', 'password123', 'mentor', '["DevOps", "Docker", "K8s"]', '[]', 'Optimizing deployment pipelines for speed.', 9, 130),
(17, 'Joseph Jackson', 'joseph@example.com', 'password123', 'mentor', '["AI Research", "PyTorch"]', '[]', 'Exploring the boundaries of deep learning.', 6, 180),
(18, 'Susan White', 'susan@example.com', 'password123', 'mentor', '["Management", "Agile"]', '[]', 'Expert in leading high-performing software teams.', 20, 200);

-- 4. Insert Sessions
INSERT INTO Sessions (id, mentorId, menteeId, topic, date, time, duration, mode, status, estimatedCost) VALUES
(1, 1, 3, 'React Best Practices', '2026-04-10 10:00:00', '10:00 AM', '60', 'Virtual', 'scheduled', 100),
(2, 2, 4, 'Intro to Pandas', '2026-03-12 14:30:00', '02:30 PM', '30', 'Phone Call', 'completed', 38),
(3, 1, 4, 'System Design deep dive', '2026-03-25 09:00:00', '09:00 AM', '90', 'In Person', 'completed', 150),
(4, 6, 3, 'Network Security Audit', '2026-04-15 11:00:00', '11:00 AM', '60', 'Virtual', 'scheduled', 90),
(5, 7, 4, 'Figma Prototyping Workshop', '2026-05-01 16:00:00', '04:00 PM', '30', 'Virtual', 'scheduled', 33),
(6, 10, 3, 'Mock Interview: Google', '2026-03-05 10:00:00', '10:00 AM', '60', 'Virtual', 'completed', 150),
(7, 8, 4, 'AWS Architecture Review', '2026-04-20 13:00:00', '01:00 PM', '60', 'In Person', 'scheduled', 120),
(8, 9, 3, 'Flutter State Management', '2026-03-28 15:00:00', '03:00 PM', '60', 'Phone Call', 'completed', 55);

-- 5. Insert Matchings
INSERT INTO Matchings (id, mentorId, menteeId, status, startDate) VALUES
(1, 1, 3, 'active', '2026-03-01 00:00:00'),
(2, 2, 4, 'active', '2026-03-15 00:00:00');

-- 6. Insert Progress
INSERT INTO Progress (id, menteeId, description, date) VALUES
(1, 3, 'Completed a small React app for learning purposes.', '2026-03-20 00:00:00'),
(2, 4, 'Finished a Pandas tutorial online.', '2026-03-25 00:00:00');
