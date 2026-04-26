# Mentorship Platform - Spring Boot Backend (Project-2)

This is the Java Spring Boot implementation of the Mentorship Platform backend, migrated from Node.js/MySQL to provide better scalability and a robust OOP structure.

## Quick Start
1. **Configuration**:
   - Database: MySQL
   - Database Name: `mentorship_db`
   - Config file: `src/main/resources/application.properties`
   - Current Password: `Chandraharsha@2006`

2. **Run via Terminal**:
   ```bash
   mvn spring-boot:run
   ```

3. **Run via Eclipse**:
   - Import as "Existing Maven Project".
   - Right-click `MentorshipBackendApplication.java` -> Run As -> Java Application.

## API Endpoints
The backend runs on **port 8080** and supports the following endpoints:

| Feature | Endpoint | Method |
| :--- | :--- | :--- |
| **Auth** | `/login` | POST |
| | `/register` | POST |
| **Users** | `/users` | GET |
| | `/mentors` | GET |
| | `/mentees` | GET |
| **Matches** | `/match` | GET/POST |
| **Sessions** | `/sessions` | GET/POST |
| **Progress** | `/progress` | GET/POST |

## Features Included
- **Full JSON support**: Correctly handles `expertise` and `interests` lists using Jackson serialization.
- **CORS Configured**: Allows connection from your React frontend (`http://localhost:5173` or any).
- **Auto Data Seeding**: Populates the database with sample mentors and sessions on first boot.
- **Password Security**: Uses WRITE_ONLY Jackson property to prevent passwords from ever leaving the backend.
