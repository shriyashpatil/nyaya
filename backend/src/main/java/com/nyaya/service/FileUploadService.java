package com.nyaya.service;

import com.nyaya.dto.DocumentReviewResponse;
import com.nyaya.entity.ReraRule;
import com.nyaya.entity.UserAction;
import com.nyaya.repository.ReraRuleRepository;
import com.nyaya.repository.UserActionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    private final ReraRuleRepository reraRuleRepository;
    private final UserActionRepository userActionRepository;
    private final ClaudeApiService claudeApiService;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg", "image/png", "image/gif"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public DocumentReviewResponse reviewDocument(MultipartFile file, String state) {
        log.info("Reviewing document: {}, state: {}", file.getOriginalFilename(), state);

        // Validate file
        if (file.isEmpty()) {
            return errorResponse("File is empty", file.getOriginalFilename(), state);
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            return errorResponse("File size exceeds 10MB limit", file.getOriginalFilename(), state);
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            return errorResponse("File type not supported. Allowed: PDF, Word, Images",
                    file.getOriginalFilename(), state);
        }

        try {
            // Extract text using Apache Tika
            Tika tika = new Tika();
            String extractedText = tika.parseToString(file.getInputStream());

            if (extractedText == null || extractedText.trim().isEmpty()) {
                return errorResponse("Could not extract text from document", file.getOriginalFilename(), state);
            }

            // Fetch RERA rules for state
            List<ReraRule> rules = reraRuleRepository.findRulesByState(state);

            // Build review prompt
            String prompt = buildReviewPrompt(extractedText, rules, state);

            // Call Claude API
            String reviewResponse = claudeApiService.sendPrompt(prompt);

            // Parse and return structured response
            DocumentReviewResponse response = parseReviewResponse(reviewResponse, file.getOriginalFilename(), state);

            // Log action
            UserAction action = UserAction.builder()
                    .actionType("DOCUMENT_REVIEW")
                    .state(state)
                    .requestData("File: " + file.getOriginalFilename() + ", Size: " + file.getSize())
                    .responseData(reviewResponse.length() > 5000 ? reviewResponse.substring(0, 5000) : reviewResponse)
                    .build();
            userActionRepository.save(action);

            return response;

        } catch (Exception e) {
            log.error("Error reviewing document: {}", e.getMessage(), e);
            return errorResponse("Failed to review document: " + e.getMessage(),
                    file.getOriginalFilename(), state);
        }
    }

    private String buildReviewPrompt(String documentText, List<ReraRule> rules, String state) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a RERA compliance expert. Review the following document for RERA compliance issues.\n\n");
        sb.append("DOCUMENT CONTENT:\n");
        // Truncate if too long
        String truncated = documentText.length() > 3000 ? documentText.substring(0, 3000) + "..." : documentText;
        sb.append(truncated).append("\n\n");
        sb.append("RERA RULES FOR ").append(state.toUpperCase()).append(":\n");

        rules.forEach(rule -> sb.append("- ")
                .append(rule.getTitle()).append(": ")
                .append(rule.getDescription()).append("\n"));

        sb.append("\nProvide a structured compliance review with:\n");
        sb.append("VIOLATIONS: List specific RERA violations found\n");
        sb.append("RISKS: List potential risks or grey areas\n");
        sb.append("RECOMMENDATIONS: List recommended corrective actions\n");
        sb.append("SEVERITY: Overall severity (LOW/MEDIUM/HIGH)\n");
        sb.append("SUMMARY: Brief overall assessment\n");

        return sb.toString();
    }

    private DocumentReviewResponse parseReviewResponse(String response, String fileName, String state) {
        // Parse Claude's structured response
        List<String> violations = extractSection(response, "VIOLATIONS:");
        List<String> risks = extractSection(response, "RISKS:");
        List<String> recommendations = extractSection(response, "RECOMMENDATIONS:");
        String severity = extractSeverity(response);
        String summary = extractSummarySection(response);

        return DocumentReviewResponse.builder()
                .status("success")
                .fileName(fileName)
                .state(state)
                .violations(violations)
                .risks(risks)
                .recommendations(recommendations)
                .severity(severity)
                .summary(summary)
                .build();
    }

    private List<String> extractSection(String response, String sectionHeader) {
        try {
            int start = response.indexOf(sectionHeader);
            if (start == -1) return List.of("See full response for details");
            int end = findNextSection(response, start + sectionHeader.length());
            String section = response.substring(start + sectionHeader.length(), end).trim();
            return Arrays.stream(section.split("\n"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        } catch (Exception e) {
            return List.of("Could not parse section");
        }
    }

    private int findNextSection(String text, int from) {
        String[] headers = {"VIOLATIONS:", "RISKS:", "RECOMMENDATIONS:", "SEVERITY:", "SUMMARY:"};
        int minIndex = text.length();
        for (String h : headers) {
            int idx = text.indexOf(h, from);
            if (idx != -1 && idx < minIndex) minIndex = idx;
        }
        return minIndex;
    }

    private String extractSeverity(String response) {
        if (response.contains("HIGH")) return "HIGH";
        if (response.contains("MEDIUM")) return "MEDIUM";
        return "LOW";
    }

    private String extractSummarySection(String response) {
        int start = response.indexOf("SUMMARY:");
        if (start == -1) return "Review completed. See violations and recommendations.";
        return response.substring(start + "SUMMARY:".length()).trim();
    }

    private DocumentReviewResponse errorResponse(String message, String fileName, String state) {
        return DocumentReviewResponse.builder()
                .status("error")
                .errorMessage(message)
                .fileName(fileName)
                .state(state)
                .build();
    }
}
