package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.service.AdaptedQuestionServiceInterface;
import com.mateco.reportgenerator.service.ImageServiceInterface;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import java.util.ArrayList;
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

    setAdaptedQuestionImage(adaptedQuestion, questionImages);

    adaptedQuestionFound.setImages(adaptedQuestion.getImages());
    adaptedQuestionFound.setAlternatives(
        updateAlternative(adaptedQuestion.getAlternatives(), adaptedQuestionFound.getAlternatives())
    );

    UpdateEntity.copyNonNullProperties(adaptedQuestion, adaptedQuestionFound);

    return adaptedQuestionRepository.save(adaptedQuestionFound);
  }

  private static void setAdaptedQuestionImage(AdaptedQuestion adaptedQuestion, List<String> questionImages) {
    int alternativeQuantity = adaptedQuestion.getAlternatives().size();
    int questionImagesQuantity = questionImages.size();
    int imagesPerAlternative = questionImagesQuantity / alternativeQuantity;
    int alternativeImageOffset = questionImagesQuantity - (imagesPerAlternative * alternativeQuantity);
    final int[] alternativeIndex = {alternativeImageOffset};

    adaptedQuestion.setImages(questionImages.subList(0,alternativeImageOffset));
    adaptedQuestion.getAlternatives().forEach((Alternative alternative) -> {
      alternative.setAdaptedQuestion(adaptedQuestion);
      alternative.setImages(questionImages.subList(
          alternativeIndex[0],
          alternativeIndex[0]+ imagesPerAlternative
      ));
      alternativeIndex[0] += imagesPerAlternative;
    });
  }

  private List<Alternative> updateAlternative(
      List<Alternative> sourceAlternatives,
      List<Alternative> targetAlternatives
  ) {
    for (int index = 0; index < Math.min(sourceAlternatives.size(), targetAlternatives.size());
        index++) {
      Alternative sourceAlternative = sourceAlternatives.get(index);
      Alternative targetAlternative = targetAlternatives.get(index);

      targetAlternative.setDescription(sourceAlternative.getDescription());
      targetAlternative.setQuestionAnswer(sourceAlternative.isQuestionAnswer());

      List<String> previousImages = targetAlternative.getImages();
      imageService.deleteImages(previousImages);
      targetAlternative.setImages(new ArrayList<>(sourceAlternative.getImages()));
    }

    return targetAlternatives;
  }
}
