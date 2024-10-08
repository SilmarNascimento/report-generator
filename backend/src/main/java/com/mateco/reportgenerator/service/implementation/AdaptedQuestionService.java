package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.service.AdaptedQuestionServiceInterface;
import com.mateco.reportgenerator.service.ImageServiceInterface;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
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
  private final ImageServiceInterface imageService;

  @Autowired
  public AdaptedQuestionService(
      AdaptedQuestionRepository adaptedQuestionRepository,
      ImageServiceInterface imageService
  ) {
    this.adaptedQuestionRepository = adaptedQuestionRepository;
    this.imageService = imageService;
  }

  @Override
  public List<AdaptedQuestion> findAllAdaptedQuestionFromMainQuestion(UUID mainQuestionId) {
    return adaptedQuestionRepository.findAllByMainQuestionId(mainQuestionId);
  }

  @Override
  public AdaptedQuestion findAdaptedQuestionsFromMainQuestionById(UUID mainQuestionId, UUID adaptedQuestionId) {
    AdaptedQuestion adaptedQuestionFound = adaptedQuestionRepository.findById(adaptedQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));

    if (!adaptedQuestionFound.getMainQuestion().getId().equals(mainQuestionId)) {
      throw new ConflictDataException("Questões principal e adaptada não relacionadas");
    }

    return adaptedQuestionFound;
  }

  @Override
  public AdaptedQuestion updateAdaptedQuestionOfMainQuestionById(
      UUID mainQuestionId,
      UUID adaptedQuestionId,
      AdaptedQuestion adaptedQuestion,
      List<String> questionImages
  ) {
    AdaptedQuestion adaptedQuestionFound = adaptedQuestionRepository.findById(adaptedQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));

    if (!adaptedQuestionFound.getMainQuestion().getId().equals(mainQuestionId)) {
      throw new ConflictDataException("Questões principal e adaptada não relacionadas");
    }

    adaptedQuestion.updateAdaptedQuestionImage(questionImages);

    List<String> bodyQuestionImages = adaptedQuestionFound.getImages();
    imageService.deleteImages(bodyQuestionImages);

    adaptedQuestionFound.setImages(adaptedQuestion.getImages());
    adaptedQuestionFound.setAlternatives(
        UpdateEntity.updateAlternative(
            adaptedQuestion.getAlternatives(),
            adaptedQuestionFound.getAlternatives(),
            imageService
        )
    );

    UpdateEntity.copyNonNullOrListProperties(adaptedQuestion, adaptedQuestionFound);

    return adaptedQuestionRepository.save(adaptedQuestionFound);
  }

}
