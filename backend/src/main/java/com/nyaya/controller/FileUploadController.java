package com.nyaya.controller;

import com.nyaya.dto.DocumentReviewResponse;
import com.nyaya.service.FileUploadService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final FileUploadService fileUploadService;

    /**
     * POST /api/documents/review
     * Upload a document and get a RERA compliance review.
     */
    @PostMapping("/review")
    public ResponseEntity<DocumentReviewResponse> reviewDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("state") @NotBlank String state) {

        log.info("Received document review request: file={}, state={}",
                file.getOriginalFilename(), state);

        DocumentReviewResponse response = fileUploadService.reviewDocument(file, state);

        if ("error".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
