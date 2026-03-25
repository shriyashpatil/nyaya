package com.nyaya.service;

import com.nyaya.dto.ChatRequest;
import com.nyaya.dto.ChatResponse;
import com.nyaya.entity.ReraRule;
import com.nyaya.entity.UserAction;
import com.nyaya.repository.ReraRuleRepository;
import com.nyaya.repository.UserActionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ReraRuleRepository reraRuleRepository;
    private final UserActionRepository userActionRepository;
    private final ClaudeApiService claudeApiService;

    public ChatResponse askQuestion(ChatRequest request) {
        log.info("Chat question for state={}: {}", request.getState(), request.getQuestion());

        try {
            // Fetch relevant RERA rules
            List<ReraRule> rules = reraRuleRepository.findRulesByState(request.getState());

            // Build chat prompt
            String prompt = buildChatPrompt(request.getQuestion(), rules, request.getState());

            // Call Claude API
            String answer = claudeApiService.sendPrompt(prompt);

            // Log user action
            UserAction action = UserAction.builder()
                    .actionType("CHAT")
                    .state(request.getState())
                    .requestData(request.getQuestion())
                    .responseData(answer.length() > 5000 ? answer.substring(0, 5000) : answer)
                    .build();
            userActionRepository.save(action);

            return ChatResponse.builder()
                    .answer(answer)
                    .status("success")
                    .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                    .build();

        } catch (Exception e) {
            log.error("Error in chat: {}", e.getMessage(), e);
            return ChatResponse.builder()
                    .status("error")
                    .errorMessage("Failed to process question: " + e.getMessage())
                    .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                    .build();
        }
    }

    private String buildChatPrompt(String question, List<ReraRule> rules, String state) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a RERA compliance expert assistant for India. ");
        sb.append("Answer the following question about RERA regulations for ").append(state).append(".\n\n");

        if (!rules.isEmpty()) {
            sb.append("RELEVANT RERA RULES FOR ").append(state.toUpperCase()).append(":\n");
            rules.stream().limit(10).forEach(rule -> {
                sb.append("- ").append(rule.getTitle()).append(": ").append(rule.getDescription()).append("\n");
            });
            sb.append("\n");
        }

        sb.append("USER QUESTION: ").append(question).append("\n\n");
        sb.append("Provide a clear, accurate, and practical answer. ");
        sb.append("Cite specific RERA rules where applicable. ");
        sb.append("If you're unsure, say so rather than providing incorrect information.");

        return sb.toString();
    }
}
