package com.mateco.reportgenerator.controller.dto.jasperReportDto;

import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record DiagnosisReportDTO(
        String studentName,
        String examName,
        String examYear,
        Integer correctAnswers,
        Integer totalQuestions,
        Double ipmScore,
        Double icpPrevious,
        Double punishmentScore,
        List<QuestionDetailDTO> questionTable,
        List<String> subjectsToReview,
        List<Integer> easyMissed,
        List<Integer> hardMissed,
        List<ChartDataDTO> top5Subjects,
        List<ChartDataDTO> distribution,
        List<ChartDataDTO> areaPerformance
) {
    public static DiagnosisReportDTO from(MockExamResponse response) {
        MockExam exam = response.getMockExam();

        List<QuestionDetailDTO> table = new ArrayList<>();
        Map<Integer, MainQuestion> questionsMap = exam.getMockExamQuestions();
        List<String> studentAnswers = response.getResponses();
        List<String> labels = List.of("A", "B", "C", "D", "E");

        for (int index = 0; index < MockExam.MAXIMUM_QUESTIONS_NUMBER; index++) {
            int questionNum = index + MockExam.INITIAL_QUESTION_NUMBER;
            MainQuestion question = questionsMap.get(questionNum);

            String studentAnswer = (studentAnswers.size() > index) ? studentAnswers.get(index) : "-";
            List<Alternative> alternatives = question.getAlternatives();
            String officialAnswer = "?";

            for (int j = 0; j < alternatives.size(); j++) {
                if (alternatives.get(j).isQuestionAnswer()) {
                    officialAnswer = labels.get(j);
                    break;
                }
            }

            table.add(
                    new QuestionDetailDTO(
                            questionNum,
                            question.getLevel(),
                            officialAnswer,
                            studentAnswer,
                            officialAnswer.equals(studentAnswer) ? "✓" : "X",
                            question.getSubjects().isEmpty() ? "Geral" : question.getSubjects().get(0).getName()
                    ));
        }

        List<ChartDataDTO> top5 = response.getTop5SubjectsPerformance().entrySet().stream()
                .map(entry -> new ChartDataDTO(
                        entry.getKey(),
                        Double.parseDouble(entry.getValue().split(" ")[0]),
                        entry.getValue()
                ))
                .toList();

        List<ChartDataDTO> distribution = response.getDifficultyPerformance().entrySet().stream()
                .map(entry -> new ChartDataDTO(
                        entry.getKey(),
                        Double.parseDouble(entry.getValue().split(" ")[0]),
                        entry.getValue()
                ))
                .toList();

        List<ChartDataDTO> area = response.getAreaPerformance().entrySet().stream()
                .map(entry -> {
                    String val = entry.getValue();
                    double percent = val.contains("(") ?
                            Double.parseDouble(val.substring(val.indexOf("(") + 1, val.indexOf("%"))) : 0.0;
                    return new ChartDataDTO(entry.getKey(), percent, val);
                }).toList();

        return new DiagnosisReportDTO(
                response.getName(), "SIMULADO " + exam.getNumber(), String.valueOf(exam.getReleasedYear()),
                response.getCorrectAnswers(), response.getTotalQuestions(), response.getIpmScore(),
                response.getIcpPrevious(), response.getPunishmentScore(), table,
                response.getSubjectsToReview(), response.getEasyMissedQuestions(),
                response.getHardMissedQuestions(), top5, distribution, area
        );
    }

    public static List<DiagnosisReportDTO> fromList(List<MockExamResponse> responses) {
        return responses.stream()
                .map(DiagnosisReportDTO::from)
                .collect(Collectors.toList());
    }

}
