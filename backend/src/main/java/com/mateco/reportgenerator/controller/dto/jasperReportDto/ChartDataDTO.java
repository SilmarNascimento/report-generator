package com.mateco.reportgenerator.controller.dto.jasperReportDto;

public record ChartDataDTO(
        String label,
        Double value,
        String displayValue
) {}
