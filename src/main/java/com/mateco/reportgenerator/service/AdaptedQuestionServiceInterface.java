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
  AdaptedQuestion findAdaptedQuestionsByMainQuestionId(UUID mainQuestionId, UUID adaptedQuestionId);
  AdaptedQuestion createAdaptedQuestion(UUID mainQuestionId, AdaptedQuestion   adaptedQuestion);
  AdaptedQuestion updateAdaptedQuestionById(UUID adaptedQuestionId, AdaptedQuestion adaptedQuestion);
  void deleteAdaptedQuestionById(UUID adaptedQuestionId);
}
