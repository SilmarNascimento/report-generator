package com.mateco.reportgenerator.controller.dto.dashboard;

import java.util.List;

public record GlobalDashboardOutputDto(
        double mediaGeralAcertos,
        double pontuacaoMaxima,
        double pontuacaoMinima,
        double indiceCoerenciaMedio,
        List<SimuladoParticipacaoDto> participacaoPorSimulado,
        List<SimuladoMediaDto> desempenhoAcumuladoPorSimulado,
        List<AreaDesempenhoDto> desempenhoAreaMate,
        List<DificuldadeDesempenhoDto> desempenhoPorDificuldade,
        List<AssuntoDesempenhoDto> desempenhoPorAssunto,
        List<Top5AssuntoDto> top5AssuntosComMaisErros
) {}
