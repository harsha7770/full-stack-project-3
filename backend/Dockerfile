FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
