package com.mateco.reportgenerator.controller.dto.jasperReportDto;

public record ChartDataDTO(
        String label,
        Double value,
        String displayValue
) {
        public String getLabel()        { return label; }
        public Double getValue()        { return value; }
        public String getDisplayValue() { return displayValue; }
}
