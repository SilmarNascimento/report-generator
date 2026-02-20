package com.mateco.reportgenerator.controller.dto.questionDto;

import com.mateco.reportgenerator.controller.dto.alternativeDto.AlternativeOutputDto;
import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamListOutputDto;
import com.mateco.reportgenerator.controller.dto.subjectDto.SubjectOutputDto;
import com.mateco.reportgenerator.enums.Pattern;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record MainQuestionOutputForMapDto(
        UUID id,
        String title,
        List<SubjectOutputDto> subjects,
        String level,
        String videoResolutionUrl,
        List<String> images,
        List<AlternativeOutputDto> alternatives,
        List<AdaptedQuestionOutputDto> adaptedQuestions,
        List<MockExamListOutputDto> mockExams,
        List<Handout> handouts,
        int lerickucas,
        Pattern pattern,
        int weight
) {
  public static MainQuestionOutputForMapDto parseDto(MainQuestion mainQuestion) {
    return new MainQuestionOutputForMapDto(
            mainQuestion.getId(),
            mainQuestion.getTitle(),
            SubjectOutputDto.parseDto(mainQuestion.getSubjects()),
            mainQuestion.getLevel(),
            mainQuestion.getVideoResolutionUrl(),
            mainQuestion.getImages(),
            AlternativeOutputDto.parseDto(mainQuestion.getAlternatives()),
            AdaptedQuestionOutputDto.parseDto(mainQuestion.getAdaptedQuestions()),
            MockExamListOutputDto.parseDto(mainQuestion.getMockExams()),
            mainQuestion.getHandout(),
            mainQuestion.getLerickucas(),
            mainQuestion.getPattern(),
            mainQuestion.getWeight()
    );
  }

  public static List<MainQuestionOutputForMapDto> parseDto(List<MainQuestion> mainQuestionList) {
    return mainQuestionList.stream()
            .map(MainQuestionOutputForMapDto::parseDto)
            .collect(Collectors.toList());
  }
}