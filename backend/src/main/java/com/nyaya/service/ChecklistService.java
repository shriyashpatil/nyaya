package com.nyaya.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyaya.dto.ChecklistRequest;
import com.nyaya.dto.ChecklistResponse;
import com.nyaya.entity.ReraRule;
import com.nyaya.entity.UserAction;
import com.nyaya.repository.ReraRuleRepository;
import com.nyaya.repository.UserActionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChecklistService {

    private final ReraRuleRepository reraRuleRepository;
    private final UserActionRepository userActionRepository;
    private final ClaudeApiService claudeApiService;
    private final ObjectMapper objectMapper;

    public ChecklistResponse generateChecklist(ChecklistRequest request) {
        log.info("Generating checklist for state={}, projectType={}, location={}",
                request.getState(), request.getProjectType(), request.getLocation());

        try {
            // Fetch RERA rules for the requested state
            List<ReraRule> rules = reraRuleRepository.findRulesByState(request.getState());
            if (rules.isEmpty()) {
                log.warn("No RERA rules found for state: {}", request.getState());
                return ChecklistResponse.builder()
                        .status("error")
                        .errorMessage("No RERA rules found for state: " + request.getState())
                        .build();
            }

            // Build prompt
            String prompt = buildChecklistPrompt(request, rules);

            // Call Claude API
            String checklist = claudeApiService.sendPrompt(prompt);

            // Log user action
            logUserAction("CHECKLIST_GENERATE", request.getState(), request, checklist);

            return ChecklistResponse.builder()
                    .checklist(checklist)
                    .status("success")
                    .state(request.getState())
                    .projectType(request.getProjectType())
                    .location(request.getLocation())
                    .build();

        } catch (Exception e) {
            log.error("Error generating checklist: {}", e.getMessage(), e);
            return ChecklistResponse.builder()
                    .status("error")
                    .errorMessage("Failed to generate checklist: " + e.getMessage())
                    .build();
        }
    }

    private String buildChecklistPrompt(ChecklistRequest request, List<ReraRule> rules) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a RERA compliance expert in India. Generate a comprehensive compliance checklist for the following project.\n\n");
        sb.append("PROJECT DETAILS:\n");
        sb.append("- State: ").append(request.getState()).append("\n");
        sb.append("- Project Type: ").append(request.getProjectType()).append("\n");
        sb.append("- Location: ").append(request.getLocation()).append("\n\n");
        sb.append("APPLICABLE RERA RULES FOR ").append(request.getState().toUpperCase()).append(":\n\n");

        rules.forEach(rule -> {
            sb.append("Rule ").append(rule.getRuleId()).append(": ").append(rule.getTitle()).append("\n");
            sb.append("Description: ").append(rule.getDescription()).append("\n");
            if (rule.getPenalty() != null) sb.append("Penalty: ").append(rule.getPenalty()).append("\n");
            if (rule.getDocumentsRequired() != null) sb.append("Documents: ").append(rule.getDocumentsRequired()).append("\n");
            if (rule.getTimeline() != null) sb.append("Timeline: ").append(rule.getTimeline()).append("\n");
            sb.append("\n");
        });

        sb.append("Based on the above rules, generate a detailed, actionable compliance checklist. ");
        sb.append("Format it as numbered sections with clear action items, required documents, deadlines, and potential penalties for non-compliance. ");
        sb.append("Make it practical and easy to follow for a real estate developer.");

        return sb.toString();
    }

    private void logUserAction(String actionType, String state, Object request, String response) {
        try {
            UserAction action = UserAction.builder()
                    .actionType(actionType)
                    .state(state)
                    .requestData(objectMapper.writeValueAsString(request))
                    .responseData(response.length() > 5000 ? response.substring(0, 5000) : response)
                    .build();
            userActionRepository.save(action);
        } catch (Exception e) {
            log.warn("Failed to log user action: {}", e.getMessage());
        }
    }
}
