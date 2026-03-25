# ---- Build Stage ----
FROM maven:3.9.5-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
# Download dependencies separately for Docker layer caching
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn clean package -DskipTests -q

# ---- Run Stage ----
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Non-root user for security
RUN groupadd -r nyaya && useradd -r -g nyaya nyaya
USER nyaya

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
