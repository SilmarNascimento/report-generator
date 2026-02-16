package com.mateco.reportgenerator.controller.dto.student;

import java.util.List;

public record YearlyPerformanceDto(
        Integer year,
        List<ClassGroupPerformanceDto> classGroups
) {
}