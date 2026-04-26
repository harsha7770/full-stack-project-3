# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and the project files
COPY pom.xml .
COPY src ./src

# Install Maven and build the application
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Run the jar file
ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
