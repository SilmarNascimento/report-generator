package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.service.AdaptedQuestionServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service - implementação dos métodos da camada service
 *           da entidade AdaptedQuestion.
 */
@Service
public class AdaptedQuestionsService implements AdaptedQuestionServiceInterface {
  private final AdaptedQuestionRepository adaptedQuestionRepository;

  @Autowired
  public AdaptedQuestionsService(AdaptedQuestionRepository adaptedQuestionRepository) {
    this.adaptedQuestionRepository = adaptedQuestionRepository;
  }

  @Override
  public List<AdaptedQuestion> findAllAdaptedQuestion() {
    return adaptedQuestionRepository.findAll();
  }

  @Override
  public AdaptedQuestion findAdaptedQuestionById(UUID adaptedQuestionId) {
    return adaptedQuestionRepository.findById(adaptedQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));
  }

  @Override
  public AdaptedQuestion createAdaptedQuestion(AdaptedQuestion adaptedQuestion) {
    return adaptedQuestionRepository.save(adaptedQuestion);
  }

  @Override
  public AdaptedQuestion updateAdaptedQuestion(
      UUID adaptedQuestionId,
      AdaptedQuestion adaptedQuestion
  ) {
    AdaptedQuestion questionFound = adaptedQuestionRepository.findById(adaptedQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));
    UpdateEntity.copyNonNullProperties(adaptedQuestion, questionFound);
    return questionFound;
  }

  @Override
  public void deleteAdaptedQuestion(UUID adaptedQuestionId) {
    adaptedQuestionRepository.deleteById(adaptedQuestionId);
  }
}
