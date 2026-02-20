package com.mateco.reportgenerator.controller.dto.mockExamDto;

import java.util.UUID;

public record MockExamResponseDto(
        UUID id,
        String mockExamName,
        Integer mockExamNumber,
        Integer correctAnswers,
        Double ipmScore
) {
}