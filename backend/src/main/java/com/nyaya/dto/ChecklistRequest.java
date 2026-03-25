package com.nyaya.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChecklistRequest {

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Project type is required")
    private String projectType;

    @NotBlank(message = "Location is required")
    private String location;
}
