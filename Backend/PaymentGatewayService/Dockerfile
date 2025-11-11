# -----------------------------------------------------------------------------
# STAGE 1: BUILD - Compiles the Java code and creates the executable JAR
# -----------------------------------------------------------------------------
# Use a JDK 17 image with Maven pre-installed as the build environment
FROM maven:3.9.5-amazoncorretto-21 AS build

# Set the working directory inside the container for the source code
WORKDIR /app

# 1. Copy the build file (pom.xml) and download dependencies
# This step is cached efficiently if only source code changes.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copy the rest of the source code
COPY src ./src

# 3. Build the Spring Boot application
# The resulting file will be in target/
# We skip tests here, as they should be run in a separate CI/CD stage
RUN mvn package -DskipTests

# -----------------------------------------------------------------------------
# STAGE 2: RUNTIME - Creates the final lightweight production image
# -----------------------------------------------------------------------------
# Use a lightweight Java Runtime Environment (JRE) base image (smaller image size)
FROM eclipse-temurin:21-jre-jammy


# Set the argument to find the generated JAR file
# NOTE: Update the 'payhere-gateway-0.0.1-SNAPSHOT.jar' name if your actual JAR name differs
ARG JAR_FILE=target/PaymentGatewayService-0.0.1-SNAPSHOT.jar

# Define the user to run the application securely (non-root)
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

# Copy the executable JAR from the build stage to the runtime stage
COPY --from=build /app/${JAR_FILE} /app/app.jar

# Define default environment variables (overridden by docker-compose)
ENV SERVER_PORT=8080

# The application runs on this port
EXPOSE 8080

# The command to run the application
# We use command line args to override application.properties for container settings
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--spring.profiles.active=prod"]