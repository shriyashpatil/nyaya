package com.nyaya.controller;

import com.nyaya.dto.ChatRequest;
import com.nyaya.dto.ChatResponse;
import com.nyaya.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    /**
     * POST /api/chat/ask
     * Ask a RERA compliance question.
     */
    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> askQuestion(
            @Valid @RequestBody ChatRequest request) {

        log.info("Chat question received for state={}", request.getState());

        ChatResponse response = chatService.askQuestion(request);

        if ("error".equals(response.getStatus())) {
            return ResponseEntity.internalServerError().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
