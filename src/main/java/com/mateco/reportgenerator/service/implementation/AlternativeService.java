package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.AlternativeRespository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.service.AlternativeServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;

public class AlternativeService implements AlternativeServiceInterface {
  private final AlternativeRespository alternativeRespository;
  private final AdaptedQuestionRepository adaptedQuestionRepository;
  private final MainQuestionRepository mainQuestionRepository;


  @Autowired
  public AlternativeService(
      AlternativeRespository alternativeRespository,
      AdaptedQuestionRepository adaptedQuestionRepository,
      MainQuestionRepository mainQuestionRepository
  ) {
    this.alternativeRespository = alternativeRespository;
    this.adaptedQuestionRepository = adaptedQuestionRepository;
    this.mainQuestionRepository = mainQuestionRepository;
  }

  @Override
  public List<Alternative> findAllAlternativesByMainQuestionId(UUID mainQuestionId) {
    MainQuestion mainQuestion = mainQuestionRepository.findById(mainQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    return mainQuestion.getAlternatives();
  }

  @Override
  public List<Alternative> findAllAlternativesByAdaptedQuestionId(UUID adaptedQuestionId) {
    AdaptedQuestion adaptedQuestion = adaptedQuestionRepository.findById(adaptedQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));
    return adaptedQuestion.getAlternatives();
  }

  @Override
  public Alternative findAlternativeById(UUID alternativeId) {
    return alternativeRespository.findById(alternativeId)
        .orElseThrow(() -> new NotFoundException("Alternativa não encontrada!"));
  }

  @Override
  public List<Alternative> createAlternatives(
      MainQuestion mainQuestion,
      List<Alternative> alternatives
  ) {
    alternatives.forEach((Alternative alternative) -> alternative.setMainQuestion(mainQuestion));
    return alternativeRespository.saveAll(alternatives);
  }

  @Override
  public List<Alternative> createAlternatives(
      AdaptedQuestion adaptedQuestion,
      List<Alternative> alternatives
  ) {
    alternatives.forEach((Alternative alternative) -> alternative.setAdaptedQuestion(adaptedQuestion));
    return alternativeRespository.saveAll(alternatives);
  }

  @Override
  public Alternative updateAlternativeById(UUID alternativetId, Alternative alternative) {
    Alternative alternativeFound = alternativeRespository.findById(alternativetId)
        .orElseThrow(() -> new NotFoundException("Alternativa não encontrada!"));
    UpdateEntity.copyNonNullProperties(alternative, alternativeFound);
    return alternativeRespository.save(alternativeFound);
  }

  @Override
  public void deleteAlternativeById(UUID alternativeId) {
    alternativeRespository.deleteById(alternativeId);
  }
}
