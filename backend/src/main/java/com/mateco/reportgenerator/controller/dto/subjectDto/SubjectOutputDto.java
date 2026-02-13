package com.mateco.reportgenerator.controller.dto.subjectDto;

import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;

public record SubjectOutputDto(
    UUID id,
    String name,
    Double fixedWeight
) {
  public static SubjectOutputDto parseDto(Subject subject) {
    return new SubjectOutputDto(
            subject.getId(),
            subject.getName(),
            subject.getFixedWeight()
    );
  }

  public static List<SubjectOutputDto> parseDto(List<Subject> subjects) {
    if (subjects == null) return List.of();
    return subjects.stream()
            .map(SubjectOutputDto::parseDto)
            .toList();
  }
}
