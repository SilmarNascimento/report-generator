package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;

public interface AlternativeServiceInterface {
  List<Alternative> findAllAlternativesByMainQuestionId(UUID mainQuestionId);
  List<Alternative> findAllAlternativesByAdaptedQuestionId(UUID adaptedQuestionId);
  Alternative findAlternativeById(UUID alternativeId);
  Alternative createAlternativeForMainQuestion(UUID mainQuestionId, Alternative alternative);
  Alternative createAlternativeForAdpatedQuestion(UUID adaptedQuestionId, Alternative alternative);
  Alternative updateAlternativeById(UUID subjectId, Alternative alternative);
  void deleteAlternativeById(UUID alternativeId);
}
