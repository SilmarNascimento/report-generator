package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
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
public class AdaptedQuestionService implements AdaptedQuestionServiceInterface {
  private final AdaptedQuestionRepository adaptedQuestionRepository;

  @Autowired
  public AdaptedQuestionService(
      AdaptedQuestionRepository adaptedQuestionRepository
  ) {
    this.adaptedQuestionRepository = adaptedQuestionRepository;
  }

  @Override
  public List<AdaptedQuestion> findAllAdaptedQuestionFromMainQuestion(UUID mainQuestionId) {
    return adaptedQuestionRepository.findAllByMainQuestionId(mainQuestionId);
  }

  @Override
  public AdaptedQuestion findAdaptedQuestionsFromMainQuestionById(UUID mainQuestionId, UUID adaptedQuestionId) {
    List<AdaptedQuestion> adaptedQuestionList = adaptedQuestionRepository.findAllByMainQuestionId(mainQuestionId);
    return adaptedQuestionList.stream()
        .filter((AdaptedQuestion adaptedQuestion) -> adaptedQuestionId.equals(adaptedQuestion.getId()))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));
  }

  @Override
  public AdaptedQuestion updateAdaptedQuestionOfMainQuestionById(
      UUID mainQuestionId,
      UUID adaptedQuestionId,
      AdaptedQuestion adaptedQuestion
  ) {
    List<AdaptedQuestion> adaptedQuestionList = adaptedQuestionRepository.findAllByMainQuestionId(mainQuestionId);
    AdaptedQuestion adaptedQuestionFound = adaptedQuestionList.stream()
        .filter((AdaptedQuestion question) -> adaptedQuestionId.equals(question.getId()))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));

    adaptedQuestion.setAlternatives(adaptedQuestionFound.getAlternatives());
    UpdateEntity.copyNonNullProperties(adaptedQuestion, adaptedQuestionFound);

    return adaptedQuestionRepository.save(adaptedQuestionFound);
  }
}
