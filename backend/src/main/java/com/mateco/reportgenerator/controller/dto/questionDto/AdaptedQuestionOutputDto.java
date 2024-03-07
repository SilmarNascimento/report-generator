package com.mateco.reportgenerator.controller.dto.questionDto;

import com.mateco.reportgenerator.controller.dto.alternativeDto.AlternativeOutputDto;
import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import java.util.List;
import java.util.UUID;

public record AdaptedQuestionOutputDto(
    UUID id,
    String title,
    String level,
    List<String> images,
    List<AlternativeOutputDto>alternatives

) {
  public static AdaptedQuestionOutputDto parseDto(AdaptedQuestion adaptedQuestion) {
    return new AdaptedQuestionOutputDto(
        adaptedQuestion.getId(),
        adaptedQuestion.getTitle(),
        adaptedQuestion.getLevel(),
        adaptedQuestion.getImages(),
        AlternativeOutputDto.parseDto(adaptedQuestion.getAlternatives())
    );
  }

  public static List<AdaptedQuestionOutputDto> parseDto(List<AdaptedQuestion> adaptedQuestionList) {
    return adaptedQuestionList.stream()
        .map((AdaptedQuestion adaptedQuestion) -> new AdaptedQuestionOutputDto(
          adaptedQuestion.getId(),
          adaptedQuestion.getTitle(),
          adaptedQuestion.getLevel(),
          adaptedQuestion.getImages(),
          AlternativeOutputDto.parseDto(adaptedQuestion.getAlternatives())
        )).toList();
  }
}
