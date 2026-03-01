package com.mateco.reportgenerator.controller.dto.jasperReportDto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Top5BarDTO {

    private String label;
    private int acertos;
    private int total;
    private int acertosWidthPx;
    private int totalWidthPx;

    private static final int MAX_WIDTH_PX = 120;

    public static List<Top5BarDTO> from(List<ChartDataDTO> top5) {
        int maxTotal = top5.stream()
                .mapToInt(d -> d.value().intValue())
                .max().orElse(1);

        return top5.stream().map(d -> {
            int valorReal = d.value().intValue();

            return new Top5BarDTO(
                    d.label(),
                    valorReal,
                    valorReal,
                    snap(valorReal, maxTotal),
                    snap(valorReal, maxTotal)
            );
        }).toList();
    }

    private static int snap(int value, int max) {
        double ratio = (double) value / max;
        return Math.max(10, (int)(Math.round(ratio * 8) * 10));
    }
}