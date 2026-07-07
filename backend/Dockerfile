# Multi-stage build for Spring Boot on Render using Docker

# Stage 1: Build the Maven application
FROM maven:3.8.5-openjdk-17 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package -DskipTests

# Stage 2: Create the runtime environment
FROM openjdk:17-jdk-slim
COPY --from=build /home/app/target/system-0.0.1-SNAPSHOT.jar /usr/local/lib/system.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/usr/local/lib/system.jar"]
