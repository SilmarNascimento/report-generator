package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.repository.AlternativeRespository;
import com.mateco.reportgenerator.service.AlternativeServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;

public class AlternativeService implements AlternativeServiceInterface {
  private final AlternativeRespository alternativeRespository;

  @Autowired
  public AlternativeService(AlternativeRespository alternativeRespository) {
    this.alternativeRespository = alternativeRespository;
  }

  @Override
  public List<Alternative> findAllAlternativesByMainQuestionId(UUID mainQuestionId) {
    return null;
  }

  @Override
  public List<Alternative> findAllAlternativesByAdaptedQuestionId(UUID adaptedQuestionId) {
    return null;
  }

  @Override
  public Alternative findAlternativeById(UUID alternativeId) {
    return alternativeRespository.findById(alternativeId)
        .orElseThrow(() -> new NotFoundException("Alternativa não encontrada!"));
  }

  @Override
  public Alternative createAlternativeForMainQuestion(UUID mainQuestionId,
      Alternative alternative) {
    return null;
  }

  @Override
  public Alternative createAlternativeForAdpatedQuestion(UUID adaptedQuestionId,
      Alternative alternative) {
    return null;
  }

  @Override
  public Alternative updateAlternativeById(UUID subjectId, Alternative alternative) {
    return null;
  }

  @Override
  public void deleteAlternativeById(UUID alternativeId) {

  }
}
