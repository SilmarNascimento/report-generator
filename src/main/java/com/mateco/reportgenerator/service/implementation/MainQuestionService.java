package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.AdaptedQuestionRepository;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.MainQuestionServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import java.util.List;
import java.util.UUID;
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
  private  final SubjectRepository subjectRepository;

  @Autowired
  public MainQuestionService(
      MainQuestionRepository mainQuestionRepository,
      AdaptedQuestionRepository adaptedQuestionRepository,
      SubjectRepository subjectRepository
  ) {
    this.mainQuestionRepository = mainQuestionRepository;
    this.adaptedQuestionRepository = adaptedQuestionRepository;
    this.subjectRepository = subjectRepository;
  }



  @Override
  public List<MainQuestion> findAllQuestions() {
    return mainQuestionRepository.findAll();
  }

  @Override
  public MainQuestion findQuestionById(UUID questionId) {
    return mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
  }

  @Override
  public MainQuestion createQuestion(MainQuestion question) {
    return mainQuestionRepository.save(question);
  }

  @Override
  public MainQuestion updateQuestion(UUID questionId, MainQuestion question) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    UpdateEntity.copyNonNullProperties(question, mainQuestionFound);
    return mainQuestionFound;
  }

  @Override
  public void deleteQuestion(UUID questionId) {
    mainQuestionRepository.deleteById(questionId);
  }

  @Override
  public Subject addSubject(UUID questionId, UUID subjectId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    Subject subjectFound = subjectRepository.findById(subjectId)
        .orElseThrow(() -> new NotFoundException("Conteúdo não encontrado!"));
    mainQuestionFound.setSubjects(subjectFound);
    return subjectFound;
  }

  @Override
  public List<Subject> addSubject(UUID questionId, List<UUID> subjectsId) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    List<Subject> subjectList = subjectRepository.findAll();
    List<Subject> mainQuestionSubjectList = subjectList.stream()
        .filter((Subject subject) -> subjectsId.contains(subject))
        .toList();
    mainQuestionSubjectList
        .forEach((Subject subject) -> mainQuestionFound.setSubjects(subject));
    return mainQuestionSubjectList;
  }

  @Override
  public void removeSubject(UUID questionId, UUID subjectId) {

  }

  @Override
  public AdaptedQuestion addAdaptedQuestion(
      UUID questionId,
      UUID adaptedQuestionId,
      AdaptedQuestion question
  ) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    return null;
  }

  @Override
  public void removeAdaptedQuestion(UUID questionId, UUID adaptedQuestionId) {

  }

  @Override
  public MockExam addMockExam(UUID questionId, UUID mockExamId, MockExam mockExam) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    return null;
  }

  @Override
  public void removeMockExam(UUID questionId, UUID mockExamId) {

  }

  @Override
  public Handout addHandout(UUID questionId, UUID handoutId, Handout handout) {
    MainQuestion mainQuestionFound = mainQuestionRepository.findById(questionId)
        .orElseThrow(() -> new NotFoundException("Questão principal não encontrada!"));
    return null;
  }

  @Override
  public void removeHandout(UUID questionId, UUID handoutId) {

  }
}
