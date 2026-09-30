package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.ImageServiceInterface;
import com.mateco.reportgenerator.service.MainQuestionServiceInterface;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.InvalidDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service - implementação dos métodos da camada service
 *           da entidade MainQuestion.
 */
@Service
public class MainQuestionService implements MainQuestionServiceInterface {
  private final MainQuestionRepository mainQuestionRepository;
  private final AdaptedQuestionRepository adaptedQuestionRepository;
  private final ImageServiceInterface imageService;
  private final SubjectRepository subjectRepository;

  @Autowired
  public MainQuestionService(
      MainQuestionRepository mainQuestionRepository,
      AdaptedQuestionRepository adaptedQuestionRepository,
      ImageServiceInterface imageService,
      SubjectRepository subjectRepository
  ) {
    this.mainQuestionRepository = mainQuestionRepository;
    this.adaptedQuestionRepository = adaptedQuestionRepository;
    this.imageService = imageService;
    this.subjectRepository = subjectRepository;
  }

  @Override
  public Page<MainQuestion> findAllMainQuestions(int pageNumber, int pageSize, String query) {
    Pageable pageable = PageRequest.of(pageNumber, pageSize);
    return mainQuestionRepository.findAll(pageable, query);
  }

  @Override
  public Page<MainQuestion> findAllFilteredMainQuestions(int pageNumber, int pageSize, String query, List<UUID> excludedQuestions) {
    Pageable pageable = PageRequest.of(pageNumber, pageSize);
    if (excludedQuestions.isEmpty()) {
      return mainQuestionRepository.findAll(pageable, query);
    }
    return mainQuestionRepository.findAll(pageable, query, excludedQuestions);
  }

  @Override
  public MainQuestion findMainQuestionById(UUID questionId) {
    return mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
  }

  private Subject resolveMainSubject(UUID mainSubjectId) {
    if (mainSubjectId == null) {
      throw new InvalidDataException("Assunto principal é obrigatório!");
    }
    return subjectRepository.findById(mainSubjectId)
        .orElseThrow(() -> new NotFoundException("Assunto principal não encontrado!"));
  }

  private List<Subject> resolveSecondarySubjects(List<UUID> secondarySubjectsId) {
    if (secondarySubjectsId == null || secondarySubjectsId.isEmpty()) {
      return new ArrayList<>();
    }
    return subjectRepository.findAllById(secondarySubjectsId);
  }

  @Override
  @Transactional
  public MainQuestion createMainQuestion(MainQuestion question, UUID mainSubjectId, List<UUID> secondarySubjectsId) {
    question.setMainSubject(resolveMainSubject(mainSubjectId));
    question.setSecondarySubjects(resolveSecondarySubjects(secondarySubjectsId));
    question.initAlternativeRelationships();

    return mainQuestionRepository.save(question);
  }

  @Override
  public MainQuestion updateMainQuestionById(UUID questionId, MainQuestion question, UUID mainSubjectId, List<UUID> secondarySubjectsId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));

    mainQuestionFound.setAlternatives(
        UpdateEntity.updateAlternative(
            question.getAlternatives(),
            mainQuestionFound.getAlternatives()
        )
    );

    question.setMainSubject(resolveMainSubject(mainSubjectId));
    List<Subject> resolvedSecondarySubjects = resolveSecondarySubjects(secondarySubjectsId);

    UpdateEntity.copyNonNullOrListProperties(question, mainQuestionFound);
    mainQuestionFound.setSecondarySubjects(resolvedSecondarySubjects);

    return mainQuestionRepository.save(mainQuestionFound);
  }

  @Override
  public void deleteMainQuestionById(UUID questionId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));

    List<String> adaptedQuestionImages = mainQuestionFound.getAllStringImages();
    if (!adaptedQuestionImages.isEmpty()) {
      imageService.deleteImages(adaptedQuestionImages);
    }

    mainQuestionRepository.deleteById(questionId);
  }

  @Override
  @Transactional
  public void deleteAllMainQuestionsByIds(List<UUID> ids) {
    ids.forEach(this::deleteMainQuestionById);
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
    adaptedQuestion.updateAdaptedQuestionImage(questionImages);

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

    imageService.deleteImages(adaptedQuestionFound.getAllStringImages());

    mainQuestionRepository.save(mainQuestionFound);
  }

}
