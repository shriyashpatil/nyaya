package com.nyaya.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {

    @NotBlank(message = "Question is required")
    private String question;

    @NotBlank(message = "State is required")
    private String state;
}
