package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.controller.dto.dashboard.*;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.model.repository.MockExamResponseRepository;
import com.mateco.reportgenerator.service.DashboardServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService implements DashboardServiceInterface {

    private final MockExamResponseRepository mockExamResponseRepository;

    @Override
    public GlobalDashboardOutputDto getGlobalDashboard(int year, List<UUID> mockExamIds) {
        List<MockExamResponse> responses = fetchResponses(year, mockExamIds);

        double mediaGeralAcertos = responses.stream()
                .filter(r -> r.getTotalQuestions() > 0)
                .mapToDouble(r -> (double) r.getCorrectAnswers() / r.getTotalQuestions() * 100)
                .average()
                .orElse(0.0);

        double pontuacaoMaxima = responses.stream()
                .filter(r -> r.getIpmScore() != null)
                .mapToDouble(MockExamResponse::getIpmScore)
                .max()
                .orElse(0.0);

        double pontuacaoMinima = responses.stream()
                .filter(r -> r.getIpmScore() != null)
                .mapToDouble(MockExamResponse::getIpmScore)
                .min()
                .orElse(0.0);

        double indiceCoerenciaMedio = responses.stream()
                .filter(r -> r.getIcpPrevious() != null)
                .mapToDouble(MockExamResponse::getIcpPrevious)
                .average()
                .orElse(0.0);

        List<SimuladoParticipacaoDto> participacaoPorSimulado = responses.stream()
                .collect(Collectors.groupingBy(r -> r.getMockExam().getName(), Collectors.counting()))
                .entrySet().stream()
                .map(e -> new SimuladoParticipacaoDto(e.getKey(), e.getValue().intValue()))
                .sorted(Comparator.comparing(SimuladoParticipacaoDto::simuladoNome))
                .toList();

        List<SimuladoMediaDto> desempenhoAcumuladoPorSimulado = responses.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getMockExam().getName(),
                        Collectors.averagingDouble(MockExamResponse::getCorrectAnswers)
                ))
                .entrySet().stream()
                .map(e -> new SimuladoMediaDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(SimuladoMediaDto::simuladoNome))
                .toList();

        List<AreaDesempenhoDto> desempenhoAreaMate = aggregateAreaPerformance(responses);
        List<DificuldadeDesempenhoDto> desempenhoPorDificuldade = aggregateDifficultyPerformance(responses);

        Map<String, int[]> subjectStats = aggregateSubjectStats(responses);

        List<AssuntoDesempenhoDto> desempenhoPorAssunto = subjectStats.entrySet().stream()
                .filter(e -> e.getValue()[1] > 0)
                .map(e -> new AssuntoDesempenhoDto(
                        e.getKey(),
                        (double) e.getValue()[0] / e.getValue()[1] * 100
                ))
                .sorted(Comparator.comparingDouble(AssuntoDesempenhoDto::media).reversed())
                .toList();

        List<Top5AssuntoDto> top5AssuntosComMaisErros = buildTop5ErrorSubjects(subjectStats);

        return new GlobalDashboardOutputDto(
                mediaGeralAcertos,
                pontuacaoMaxima,
                pontuacaoMinima,
                indiceCoerenciaMedio,
                participacaoPorSimulado,
                desempenhoAcumuladoPorSimulado,
                desempenhoAreaMate,
                desempenhoPorDificuldade,
                desempenhoPorAssunto,
                top5AssuntosComMaisErros
        );
    }

    @Override
    public IndividualDashboardOutputDto getIndividualDashboard(Long studentId, int year, List<UUID> mockExamIds) {
        List<MockExamResponse> responses = fetchStudentResponses(studentId, year, mockExamIds);

        if (responses.isEmpty()) {
            throw new NotFoundException("Nenhuma resposta encontrada para o aluno no período selecionado");
        }

        String studentName = responses.get(0).getName();

        int totalAcertos = responses.stream().mapToInt(MockExamResponse::getCorrectAnswers).sum();
        int totalQuestoes = responses.stream().mapToInt(MockExamResponse::getTotalQuestions).sum();
        MediaGeralDto mediaGeralAcertos = new MediaGeralDto(totalAcertos, totalQuestoes);

        MockExamResponse maxResponse = responses.stream()
                .max(Comparator.comparingInt(MockExamResponse::getCorrectAnswers))
                .orElse(responses.get(0));
        PontuacaoDetalheDto pontuacaoMaxima = new PontuacaoDetalheDto(
                maxResponse.getCorrectAnswers(),
                maxResponse.getTotalQuestions(),
                maxResponse.getMockExam().getName()
        );

        MockExamResponse minResponse = responses.stream()
                .min(Comparator.comparingInt(MockExamResponse::getCorrectAnswers))
                .orElse(responses.get(0));
        PontuacaoDetalheDto pontuacaoMinima = new PontuacaoDetalheDto(
                minResponse.getCorrectAnswers(),
                minResponse.getTotalQuestions(),
                minResponse.getMockExam().getName()
        );

        double indiceCoerenciaMedio = responses.stream()
                .filter(r -> r.getIcpPrevious() != null)
                .mapToDouble(MockExamResponse::getIcpPrevious)
                .average()
                .orElse(0.0);

        List<SimuladoAcertosDto> desempenhoAcumuladoPorSimulado = responses.stream()
                .sorted(Comparator.comparing(r -> r.getMockExam().getName()))
                .map(r -> new SimuladoAcertosDto(r.getMockExam().getName(), r.getCorrectAnswers()))
                .toList();

        List<AreaDesempenhoDto> desempenhoAreaMate = aggregateAreaPerformance(responses);
        List<DificuldadeDesempenhoDto> desempenhoPorDificuldade = aggregateDifficultyPerformance(responses);

        Map<String, int[]> subjectStats = aggregateSubjectStats(responses);
        List<AssuntoDesempenhoDto> desempenhoPorAssunto = subjectStats.entrySet().stream()
                .filter(e -> e.getValue()[1] > 0)
                .map(e -> new AssuntoDesempenhoDto(
                        e.getKey(),
                        (double) e.getValue()[0] / e.getValue()[1] * 100
                ))
                .sorted(Comparator.comparingDouble(AssuntoDesempenhoDto::media).reversed())
                .toList();

        List<AssuntoRevisaoDto> top3AssuntosParaRevisar = buildTop3ReviewSubjects(responses);

        return new IndividualDashboardOutputDto(
                studentName,
                mediaGeralAcertos,
                pontuacaoMaxima,
                pontuacaoMinima,
                indiceCoerenciaMedio,
                desempenhoAcumuladoPorSimulado,
                desempenhoAreaMate,
                desempenhoPorDificuldade,
                desempenhoPorAssunto,
                top3AssuntosParaRevisar
        );
    }

    private List<MockExamResponse> fetchResponses(int year, List<UUID> mockExamIds) {
        if (mockExamIds == null || mockExamIds.isEmpty()) {
            return mockExamResponseRepository.findByMockExamYear(year);
        }
        return mockExamResponseRepository.findByMockExamYearAndIdIn(year, mockExamIds);
    }

    private List<MockExamResponse> fetchStudentResponses(Long studentId, int year, List<UUID> mockExamIds) {
        if (mockExamIds == null || mockExamIds.isEmpty()) {
            return mockExamResponseRepository.findByStudentIdAndMockExamYear(studentId, year);
        }
        return mockExamResponseRepository.findByStudentIdAndMockExamYearAndIdIn(studentId, year, mockExamIds);
    }

    private List<AreaDesempenhoDto> aggregateAreaPerformance(List<MockExamResponse> responses) {
        Map<String, List<Double>> areaStatsMap = new HashMap<>();
        for (MockExamResponse r : responses) {
            if (r.getAreaPerformance() == null) continue;
            r.getAreaPerformance().forEach((area, val) -> {
                double pct = parsePorcentagem(val);
                areaStatsMap.computeIfAbsent(area, k -> new ArrayList<>()).add(pct);
            });
        }
        return areaStatsMap.entrySet().stream()
                .map(e -> new AreaDesempenhoDto(
                        e.getKey(),
                        e.getValue().stream().mapToDouble(d -> d).average().orElse(0.0)
                ))
                .sorted(Comparator.comparing(AreaDesempenhoDto::area))
                .toList();
    }

    private List<DificuldadeDesempenhoDto> aggregateDifficultyPerformance(List<MockExamResponse> responses) {
        Map<String, List<Double>> diffStatsMap = new HashMap<>();
        for (MockExamResponse r : responses) {
            if (r.getDifficultyPerformance() == null) continue;
            r.getDifficultyPerformance().forEach((nivel, val) -> {
                double pct = parsePorcentagem(val);
                diffStatsMap.computeIfAbsent(nivel, k -> new ArrayList<>()).add(pct);
            });
        }
        return diffStatsMap.entrySet().stream()
                .map(e -> new DificuldadeDesempenhoDto(
                        e.getKey(),
                        e.getValue().stream().mapToDouble(d -> d).average().orElse(0.0)
                ))
                .toList();
    }

    private Map<String, int[]> aggregateSubjectStats(List<MockExamResponse> responses) {
        Map<String, int[]> subjectStats = new HashMap<>();
        for (MockExamResponse r : responses) {
            if (r.getTop5SubjectsPerformance() == null) continue;
            r.getTop5SubjectsPerformance().forEach((subject, val) -> {
                int[] parsed = parseAcertosTotal(val);
                subjectStats.merge(subject, parsed, (a, b) -> new int[]{a[0] + b[0], a[1] + b[1]});
            });
        }
        return subjectStats;
    }

    private List<Top5AssuntoDto> buildTop5ErrorSubjects(Map<String, int[]> subjectStats) {
        List<Map.Entry<String, Double>> sorted = subjectStats.entrySet().stream()
                .filter(e -> e.getValue()[1] > 0)
                .map(e -> Map.entry(
                        e.getKey(),
                        100.0 - (double) e.getValue()[0] / e.getValue()[1] * 100
                ))
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(5)
                .toList();

        List<Top5AssuntoDto> result = new ArrayList<>();
        for (int i = 0; i < sorted.size(); i++) {
            result.add(new Top5AssuntoDto(i + 1, sorted.get(i).getKey(), sorted.get(i).getValue()));
        }
        return result;
    }

    private List<AssuntoRevisaoDto> buildTop3ReviewSubjects(List<MockExamResponse> responses) {
        Map<String, Integer> frequency = new LinkedHashMap<>();
        for (MockExamResponse r : responses) {
            if (r.getSubjectsToReview() == null) continue;
            for (int i = 0; i < r.getSubjectsToReview().size(); i++) {
                String subject = r.getSubjectsToReview().get(i);
                frequency.merge(subject, 1, Integer::sum);
            }
        }

        List<String> top3 = frequency.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .toList();

        String[] prioridades = {"ALTA", "MEDIA", "BAIXA"};
        List<AssuntoRevisaoDto> result = new ArrayList<>();
        for (int i = 0; i < top3.size(); i++) {
            result.add(new AssuntoRevisaoDto(top3.get(i), prioridades[i]));
        }
        return result;
    }

    private double parsePorcentagem(String val) {
        if (val == null || !val.contains("(")) return 0.0;
        try {
            return Double.parseDouble(val.substring(val.indexOf("(") + 1, val.indexOf("%")));
        } catch (Exception e) {
            return 0.0;
        }
    }

    private int[] parseAcertosTotal(String val) {
        if (val == null) return new int[]{0, 0};
        try {
            String[] parts = val.split(" de ");
            return new int[]{Integer.parseInt(parts[0].trim()), Integer.parseInt(parts[1].trim().split(" ")[0])};
        } catch (Exception e) {
            return new int[]{0, 0};
        }
    }
}
