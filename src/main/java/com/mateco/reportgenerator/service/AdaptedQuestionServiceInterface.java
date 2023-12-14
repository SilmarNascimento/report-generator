package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import java.util.List;
import java.util.UUID;

/**
 * Service Interface - assinatura dos métodos para a camada service
 *                     da entidade AdaptedQuestion.
 */
public interface AdaptedQuestionServiceInterface {
  List<AdaptedQuestion> findAllAdaptedQuestionFromMainQuestion(UUID mainQuestionId);
  AdaptedQuestion findAdaptedQuestionsFromMainQuestionById(UUID mainQuestionId, UUID adaptedQuestionId);
  AdaptedQuestion createAdaptedQuestionForMainQuestion(UUID mainQuestionId, AdaptedQuestion adaptedQuestion);
  AdaptedQuestion updateAdaptedQuestionOfMainQuestionById(UUID mainQuestionId, UUID adaptedQuestionId, AdaptedQuestion adaptedQuestion);
  void deleteAdaptedQuestionFromMainQuestionById(UUID mainQuestionId, UUID adaptedQuestionId);
}
