package com.mateco.reportgenerator.controller.dto.student;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamResponseDto;
import com.mateco.reportgenerator.enums.ClassGroup;

import java.util.List;

public record ClassGroupPerformanceDto(
        @JsonProperty("name")
        ClassGroup classGroup,
        List<MockExamResponseDto> exams
) {
}