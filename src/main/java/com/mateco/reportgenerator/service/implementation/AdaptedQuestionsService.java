package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.service.AdaptedQuestionServiceInterface;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

/**
 * Service - implementação dos métodos da camada service
 *           da entidade AdaptedQuestion.
 */
@Service
public class AdaptedQuestionsService implements AdaptedQuestionServiceInterface {

  @Override
  public List<AdaptedQuestion> findAllAdaptedQuestion() {
    return null;
  }

  @Override
  public AdaptedQuestion findAdaptedQuestionById(UUID adaptedQuestionId) {
    return null;
  }

  @Override
  public AdaptedQuestion createAdaptedQuestion(AdaptedQuestion adaptedQuestion) {
    return null;
  }

  @Override
  public AdaptedQuestion updateAdaptedQuestion(UUID adaptedQuestionId,
      AdaptedQuestion adaptedQuestion) {
    return null;
  }

  @Override
  public void deleteAdaptedQuestion(UUID adaptedQuestionId) {

  }
}
