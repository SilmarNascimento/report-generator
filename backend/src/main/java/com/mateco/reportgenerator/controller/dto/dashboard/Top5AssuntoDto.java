package com.mateco.reportgenerator.controller.dto.dashboard;

public record Top5AssuntoDto(
        int rank,
        String assunto,
        double taxaErro
) {}
