package com.nyaya;

import com.nyaya.dto.ChecklistRequest;
import com.nyaya.dto.ChecklistResponse;
import com.nyaya.entity.ReraRule;
import com.nyaya.repository.ReraRuleRepository;
import com.nyaya.repository.UserActionRepository;
import com.nyaya.service.ChecklistService;
import com.nyaya.service.ClaudeApiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChecklistServiceTest {

    @Mock
    private ReraRuleRepository reraRuleRepository;

    @Mock
    private UserActionRepository userActionRepository;

    @Mock
    private ClaudeApiService claudeApiService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private ChecklistService checklistService;

    private ReraRule mockRule;
    private ChecklistRequest mockRequest;

    @BeforeEach
    void setUp() {
        mockRule = ReraRule.builder()
                .id(1L)
                .ruleId("RERA_MH_001")
                .state("Maharashtra")
                .title("Project Registration")
                .description("All projects above 500 sq meters must be registered with MahaRERA.")
                .penalty("Up to 10% of project cost")
                .timeline("60 days before launch")
                .build();

        mockRequest = new ChecklistRequest();
        mockRequest.setState("Maharashtra");
        mockRequest.setProjectType("Residential");
        mockRequest.setLocation("Mumbai");
    }

    @Test
    void generateChecklist_Success() throws Exception {
        // Arrange
        when(reraRuleRepository.findRulesByState("Maharashtra")).thenReturn(List.of(mockRule));
        when(claudeApiService.sendPrompt(anyString())).thenReturn("1. Register project with MahaRERA...");
        when(objectMapper.writeValueAsString(any())).thenReturn("{}");

        // Act
        ChecklistResponse response = checklistService.generateChecklist(mockRequest);

        // Assert
        assertEquals("success", response.getStatus());
        assertNotNull(response.getChecklist());
        assertEquals("Maharashtra", response.getState());
        verify(claudeApiService, times(1)).sendPrompt(anyString());
    }

    @Test
    void generateChecklist_NoRulesFound() {
        // Arrange
        when(reraRuleRepository.findRulesByState("Maharashtra")).thenReturn(List.of());

        // Act
        ChecklistResponse response = checklistService.generateChecklist(mockRequest);

        // Assert
        assertEquals("error", response.getStatus());
        assertTrue(response.getErrorMessage().contains("No RERA rules found"));
        verify(claudeApiService, never()).sendPrompt(anyString());
    }

    @Test
    void generateChecklist_ClaudeApiFailure() throws Exception {
        // Arrange
        when(reraRuleRepository.findRulesByState("Maharashtra")).thenReturn(List.of(mockRule));
        when(claudeApiService.sendPrompt(anyString())).thenThrow(new RuntimeException("API timeout"));

        // Act
        ChecklistResponse response = checklistService.generateChecklist(mockRequest);

        // Assert
        assertEquals("error", response.getStatus());
        assertTrue(response.getErrorMessage().contains("Failed to generate checklist"));
    }
}
