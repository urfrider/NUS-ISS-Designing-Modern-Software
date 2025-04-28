# Step 1: Build the application using Gradle
FROM gradle:7.5.1-jdk17 AS build

WORKDIR /app

# Copy build files
COPY build.gradle settings.gradle /app/
COPY gradle /app/gradle
COPY gradlew /app/gradlew 
COPY src /app/src

# Give permission to execute the wrapper script
RUN chmod +x ./gradlew

# Build the app
RUN ./gradlew build --no-daemon

# Step 2: Run the app
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar
COPY --from=build /app/build/libs/backend-0.0.1.jar /app/app.jar

COPY .env /app/.env


EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
