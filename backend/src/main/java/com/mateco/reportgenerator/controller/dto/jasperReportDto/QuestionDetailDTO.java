package com.mateco.reportgenerator.controller.dto.jasperReportDto;

public record QuestionDetailDTO(
        Integer id,
        String level,
        String officialAnswer,
        String studentAnswer,
        String status, // "✓" ou "X"
        String subject
) {}
