package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Alternative;
import com.mateco.reportgenerator.model.entity.Attachment;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.AlternativeRespository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.AlternativeServiceInterface;
import com.mateco.reportgenerator.service.ImageServiceInterface;
import com.mateco.reportgenerator.service.MainQuestionServiceInterface;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service - implementação dos métodos da camada service
 *           da entidade MainQuestion.
 */
@Service
public class MainQuestionService implements MainQuestionServiceInterface {

  private final MainQuestionRepository mainQuestionRepository;
  private final AdaptedQuestionRepository adaptedQuestionRepository;
  private final AlternativeServiceInterface alternativeService;
  private final ImageServiceInterface imageService;
  private final SubjectRepository subjectRepository;

  @Autowired
  public MainQuestionService(
      MainQuestionRepository mainQuestionRepository,
      AdaptedQuestionRepository adaptedQuestionRepository,
      AlternativeService alternativeService,
      ImageServiceInterface imageService,
      SubjectRepository subjectRepository
  ) {
    this.mainQuestionRepository = mainQuestionRepository;
    this.adaptedQuestionRepository = adaptedQuestionRepository;
    this.alternativeService = alternativeService;
    this.imageService = imageService;
    this.subjectRepository = subjectRepository;
  }

  @Override
  public List<MainQuestion> findAllMainQuestions() {
    return mainQuestionRepository.findAll();
  }

  @Override
  public MainQuestion findMainQuestionById(UUID questionId) {
    return mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
  }

  @Override
  @Transactional
  public MainQuestion createMainQuestion(MainQuestion question, List<String> questionImages) {
    setMainQuestionImages(question, questionImages);

    return mainQuestionRepository.save(question);
  }

  @Override
  public MainQuestion updateMainQuestionById(UUID questionId, MainQuestion question,
      List<String> questionImages) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));

    setMainQuestionImages(question, questionImages);

    mainQuestionFound.setImages(question.getImages());
    mainQuestionFound.setAlternatives(
        updateAlternative(question.getAlternatives(), mainQuestionFound.getAlternatives())
    );

    UpdateEntity.copyNonNullProperties(question, mainQuestionFound);

    return mainQuestionRepository.save(mainQuestionFound);
  }

  @Override
  public void deleteMainQuestionById(UUID questionId) {
    mainQuestionRepository.deleteById(questionId);
  }

  @Override
  @Transactional
  public MainQuestion addSubject(UUID questionId, List<UUID> subjectsId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));

    List<Subject> subjectListToAdd = subjectRepository.findAllById(subjectsId);
    if (subjectListToAdd.isEmpty()) {
      throw new NotFoundException("Nenhum assunto encontrado com os IDs fornecidos!");
    }

    Set<Subject> previousSubjectSet = new HashSet<>(mainQuestionFound.getSubjects());
    previousSubjectSet.addAll(subjectListToAdd);
    mainQuestionFound.setSubjects(new ArrayList<>(previousSubjectSet));

    return mainQuestionRepository.save(mainQuestionFound);
  }

  @Override
  @Transactional
  public void removeSubject(UUID questionId, List<UUID> subjectsId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));

    mainQuestionFound.getSubjects().removeIf(subject -> subjectsId.contains(subject.getId()));

    mainQuestionRepository.save(mainQuestionFound);
  }

  @Override
  public MainQuestion addAdaptedQuestion(
      UUID questionId,
      AdaptedQuestion adaptedQuestion,
      List<String> questionImages
  ) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));

    adaptedQuestion.setMainQuestion(mainQuestionFound);
    setAdaptedQuestionImage(adaptedQuestion, questionImages);

    mainQuestionFound.getAdaptedQuestions().add(adaptedQuestion);

    return mainQuestionRepository.save(mainQuestionFound);
  }

  @Override
  public void removeAdaptedQuestion(UUID questionId, UUID adaptedQuestionId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    AdaptedQuestion adaptedQuestionFound = adaptedQuestionRepository.findById(adaptedQuestionId)
        .orElseThrow(() -> new NotFoundException("Questão adaptada não encontrada!"));

    if (!adaptedQuestionFound.getMainQuestion().equals(mainQuestionFound)) {
      throw new ConflictDataException("Questão adaptada não pertence à questão principal!");
    }

    mainQuestionFound.getAdaptedQuestions()
        .removeIf(adaptedQuestion -> adaptedQuestionId.equals(adaptedQuestion.getId()));

    mainQuestionRepository.save(mainQuestionFound);
  }

  private static void setMainQuestionImages(MainQuestion question, List<String> questionImages) {
    int alternativeQuantity = question.getAlternatives().size();
    int questionImagesQuantity = questionImages.size();
    int imagesPerAlternative = questionImagesQuantity / alternativeQuantity;
    int alternativeImageOffset =
        questionImagesQuantity - (imagesPerAlternative * alternativeQuantity);
    final int[] alternativeIndex = {alternativeImageOffset};

    question.setImages(questionImages.subList(0, alternativeImageOffset));
    question.getAlternatives().forEach((Alternative alternative) -> {
      alternative.setMainQuestion(question);
      alternative.setImages(questionImages.subList(
          alternativeIndex[0],
          alternativeIndex[0] + imagesPerAlternative
      ));
      alternativeIndex[0] += imagesPerAlternative;
    });
  }

  private static void setAdaptedQuestionImage(AdaptedQuestion adaptedQuestion,
      List<String> questionImages) {
    int alternativeQuantity = adaptedQuestion.getAlternatives().size();
    int questionImagesQuantity = questionImages.size();
    int imagesPerAlternative = questionImagesQuantity / alternativeQuantity;
    int alternativeImageOffset =
        questionImagesQuantity - (imagesPerAlternative * alternativeQuantity);
    final int[] alternativeIndex = {alternativeImageOffset};

    adaptedQuestion.setImages(questionImages.subList(0, alternativeImageOffset));
    adaptedQuestion.getAlternatives().forEach((Alternative alternative) -> {
      alternative.setAdaptedQuestion(adaptedQuestion);
      alternative.setImages(questionImages.subList(
          alternativeIndex[0],
          alternativeIndex[0] + imagesPerAlternative
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
