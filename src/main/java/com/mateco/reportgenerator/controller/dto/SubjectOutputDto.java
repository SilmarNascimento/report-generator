package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;

public record SubjectOutputDto(UUID id, String name, List<UUID> mainQuestionsId) {
  public static SubjectOutputDto parseDto(Subject subject) {
    List<MainQuestion> questionsList = subject.getMainQuestions();
    List<UUID> questionsId = questionsList.stream()
        .map((MainQuestion question) -> question.getId())
        .toList();
    return new SubjectOutputDto(subject.getId(), subject.getName(), questionsId);
  }
}
