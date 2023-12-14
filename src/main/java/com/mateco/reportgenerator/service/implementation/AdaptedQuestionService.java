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
  private final MainQuestionRepository mainQuestionRepository;

  @Autowired
  public AdaptedQuestionService(
      AdaptedQuestionRepository adaptedQuestionRepository,
      MainQuestionRepository mainQuestionRepository
  ) {
    this.adaptedQuestionRepository = adaptedQuestionRepository;
    this.mainQuestionRepository = mainQuestionRepository;
  }

  @Override
  public List<AdaptedQuestion> findAllAdaptedQuestionFromMainQuestion(UUID mainQuestionId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(mainQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    return mainQuestionFound.getAdaptedQuestions();
  }

  @Override
  public AdaptedQuestion findAdaptedQuestionsFromMainQuestionById(UUID mainQuestionId, UUID adaptedQuestionId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(mainQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    return mainQuestionFound.getAdaptedQuestions().stream()
        .filter((AdaptedQuestion adaptedQuestion) -> adaptedQuestionId.equals(adaptedQuestion.getId()))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));
  }

  @Override
  public AdaptedQuestion createAdaptedQuestionForMainQuestion(UUID mainQuestionId, AdaptedQuestion adaptedQuestion) {
    MainQuestion questionFound = mainQuestionRepository.findById(mainQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    adaptedQuestion.setMainQuestion(questionFound);
    return adaptedQuestionRepository.save(adaptedQuestion);
  }

  @Override
  public AdaptedQuestion updateAdaptedQuestionOfMainQuestionById(
      UUID mainQuestionId,
      UUID adaptedQuestionId,
      AdaptedQuestion adaptedQuestion
  ) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(mainQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    AdaptedQuestion adaptedQuestionFound = mainQuestionFound.getAdaptedQuestions().stream()
        .filter((AdaptedQuestion question) -> adaptedQuestionId.equals(question.getId()))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));

    UpdateEntity.copyNonNullProperties(adaptedQuestion, adaptedQuestionFound);
    adaptedQuestionRepository.save(adaptedQuestionFound);

    return adaptedQuestionFound;
  }

  @Override
  public void deleteAdaptedQuestionFromMainQuestionById(UUID mainQuestionId, UUID adaptedQuestionId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(mainQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    mainQuestionFound.getAdaptedQuestions().stream()
        .filter((AdaptedQuestion question) -> adaptedQuestionId.equals(question.getId()))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));

    adaptedQuestionRepository.deleteById(adaptedQuestionId);
  }
}
