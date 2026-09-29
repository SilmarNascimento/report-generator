package com.mateco.reportgenerator.controller.dto.dashboard;

public record PontuacaoDetalheDto(
        int acertos,
        int total,
        String simuladoNome
) {}
