package com.mateco.reportgenerator.controller.dto.subjectDto;

import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;

public record SubjectOutputDto(
    UUID id,
    String name
) {
  public static SubjectOutputDto parseDto(Subject subject) {
    return new SubjectOutputDto(subject.getId(), subject.getName());
  }

  public static List<SubjectOutputDto>  parseDto(List<Subject> subjects) {
    return subjects.stream()
        .map((Subject subject) -> new SubjectOutputDto(subject.getId(), subject.getName()))
        .toList();
  }
}
