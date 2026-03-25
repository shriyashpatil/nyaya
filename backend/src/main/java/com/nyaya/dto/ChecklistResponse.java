package com.nyaya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistResponse {
    private String checklist;
    private String status;
    private String state;
    private String projectType;
    private String location;
    private String errorMessage;
}
