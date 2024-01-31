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

    setAdaptedQuestionImage(adaptedQuestionFound, questionImages);
    adaptedQuestionFound.setAlternatives(
        updateAlternative(adaptedQuestion.getAlternatives(), adaptedQuestionFound.getAlternatives())
    );

    UpdateEntity.setCollectionsProperty(adaptedQuestion, adaptedQuestionFound);
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
    final int[] index = {0};
    return targetAlternatives.stream()
        .map((Alternative alternative) -> {
          alternative.setDescription(sourceAlternatives.get(index[0]).getDescription());
          alternative.setQuestionAnswer(sourceAlternatives.get(index[0]).isQuestionAnswer());
          List<String> previousImages = alternative.getImages();
          imageService.deleteImages(previousImages);
          alternative.setImages(sourceAlternatives.get(index[0]).getImages());
          index[0] += 1;

          return alternative;
        })
        .toList();
  }
}
