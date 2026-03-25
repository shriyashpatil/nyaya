package com.nyaya.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class ClaudeApiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${claude.api.key}")
    private String apiKey;

    @Value("${claude.api.model:claude-sonnet-4-6}")
    private String model;

    @Value("${claude.api.max-tokens:2000}")
    private int maxTokens;

    @Value("${claude.api.timeout:30}")
    private int timeoutSeconds;

    public ClaudeApiService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        // Configure Netty HTTP client with explicit read/write timeouts
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10_000)
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(120, TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(30, TimeUnit.SECONDS)));

        this.webClient = webClientBuilder
                .baseUrl("https://api.anthropic.com")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("content-type", MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.objectMapper = objectMapper;
    }

    /**
     * Send a prompt to Claude API and return the text response.
     */
    public String sendPrompt(String prompt) {
        log.info("Sending prompt to Claude API (length: {} chars)", prompt.length());

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "max_tokens", maxTokens,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        try {
            String responseJson = webClient.post()
                    .uri("/v1/messages")
                    .header("x-api-key", apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .onErrorMap(WebClientResponseException.class, ex -> {
                        log.error("Claude API error: status={}, body={}", ex.getStatusCode(), ex.getResponseBodyAsString());
                        return new RuntimeException("Claude API error: " + ex.getMessage(), ex);
                    })
                    .block();

            return extractTextFromResponse(responseJson);

        } catch (Exception e) {
            log.error("Failed to call Claude API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get response from Claude API: " + e.getMessage(), e);
        }
    }

    private String extractTextFromResponse(String responseJson) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode content = root.path("content");
            if (content.isArray() && !content.isEmpty()) {
                return content.get(0).path("text").asText();
            }
            throw new RuntimeException("Unexpected Claude API response structure");
        } catch (Exception e) {
            log.error("Failed to parse Claude API response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse Claude API response", e);
        }
    }
}
