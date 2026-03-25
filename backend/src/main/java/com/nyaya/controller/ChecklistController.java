package com.nyaya.controller;

import com.nyaya.dto.ChecklistRequest;
import com.nyaya.dto.ChecklistResponse;
import com.nyaya.service.ChecklistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checklist")
@RequiredArgsConstructor
@Slf4j
public class ChecklistController {

    private final ChecklistService checklistService;

    /**
     * POST /api/checklist/generate
     * Generate a RERA compliance checklist for a given state and project.
     */
    @PostMapping("/generate")
    public ResponseEntity<ChecklistResponse> generateChecklist(
            @Valid @RequestBody ChecklistRequest request) {

        log.info("Received checklist request: state={}, type={}, location={}",
                request.getState(), request.getProjectType(), request.getLocation());

        ChecklistResponse response = checklistService.generateChecklist(request);

        if ("error".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
