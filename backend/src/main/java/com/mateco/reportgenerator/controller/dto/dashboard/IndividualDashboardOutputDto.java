package com.mateco.reportgenerator.controller.dto.dashboard;

import java.util.List;

public record IndividualDashboardOutputDto(
        String studentName,
        MediaGeralDto mediaGeralAcertos,
        PontuacaoDetalheDto pontuacaoMaxima,
        PontuacaoDetalheDto pontuacaoMinima,
        double indiceCoerenciaMedio,
        List<SimuladoAcertosDto> desempenhoAcumuladoPorSimulado,
        List<AreaDesempenhoDto> desempenhoAreaMate,
        List<DificuldadeDesempenhoDto> desempenhoPorDificuldade,
        List<AssuntoDesempenhoDto> desempenhoPorAssunto,
        List<AssuntoRevisaoDto> top3AssuntosParaRevisar
) {}
