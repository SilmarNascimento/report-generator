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
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
  public MainQuestion findMainQuestionById(UUID questionId) {
    return mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
  }

  @Override
  @Transactional
  public MainQuestion createMainQuestion(MainQuestion question, List<String> questionImages) {
    question.updateMainQuestionImages(questionImages);

    return mainQuestionRepository.save(question);
  }

  @Override
  public MainQuestion updateMainQuestionById(UUID questionId, MainQuestion question,
      List<String> questionImages) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));

    question.updateMainQuestionImages(questionImages);

    List<String> bodyQuestionImages = mainQuestionFound.getImages();
    imageService.deleteImages(bodyQuestionImages);

    mainQuestionFound.setImages(question.getImages());
    mainQuestionFound.setAlternatives(
        UpdateEntity.updateAlternative(
            question.getAlternatives(),
            mainQuestionFound.getAlternatives(),
            imageService
        )
    );

    UpdateEntity.copyNonNullOrListProperties(question, mainQuestionFound);

    return mainQuestionRepository.save(mainQuestionFound);
  }

  @Override
  public void deleteMainQuestionById(UUID questionId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));

    imageService.deleteImages(mainQuestionFound.getAllStringImages());

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
