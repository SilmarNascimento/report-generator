package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.Alternative;
import java.util.List;
import java.util.UUID;

public record AlternativeOutputDto(
    UUID id,
    String description,
    List<String> images,
    boolean questionAnswer
) {

  public static List<AlternativeOutputDto> parseDto(List<Alternative> alternatives) {
    return alternatives.stream()
        .map((Alternative alternative) -> new AlternativeOutputDto(
          alternative.getId(),
          alternative.getDescription(),
          alternative.getImages(),
          alternative.isQuestionAnswer()))
        .toList();
  }
}
