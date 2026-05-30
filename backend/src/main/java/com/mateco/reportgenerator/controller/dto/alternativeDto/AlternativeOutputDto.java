package com.mateco.reportgenerator.controller.dto.alternativeDto;

import com.mateco.reportgenerator.model.entity.Alternative;
import java.util.List;
import java.util.UUID;

public record AlternativeOutputDto(
    UUID id,
    boolean questionAnswer
) {

  public static List<AlternativeOutputDto> parseDto(List<Alternative> alternatives) {
    return alternatives.stream()
        .map(alternative -> new AlternativeOutputDto(
            alternative.getId(),
            alternative.isQuestionAnswer()))
        .toList();
  }
}
