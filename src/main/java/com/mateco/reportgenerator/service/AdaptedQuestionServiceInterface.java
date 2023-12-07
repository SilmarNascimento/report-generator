package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import java.util.List;
import java.util.UUID;

public interface AdaptedQuestionServiceInterface {
  List<AdaptedQuestion> findAllAdaptedQuestion();
  AdaptedQuestion findAdaptedQuestionById(UUID adaptedQuestionId);
  AdaptedQuestion createAdaptedQuestion(AdaptedQuestion adaptedQuestion);
  AdaptedQuestion updateAdaptedQuestion(UUID adaptedQuestionId, AdaptedQuestion adaptedQuestion);
  void deleteAdaptedQuestion(UUID adaptedQuestionId);
}
