package com.nyaya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentReviewResponse {
    private String status;
    private String summary;
    private List<String> violations;
    private List<String> risks;
    private List<String> recommendations;
    private String severity;       // LOW | MEDIUM | HIGH
    private String fileName;
    private String state;
    private String errorMessage;
}
