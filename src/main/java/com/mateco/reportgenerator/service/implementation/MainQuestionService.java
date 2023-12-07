package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.service.MainQuestionServiceInterface;
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

  @Autowired
  public MainQuestionService(MainQuestionRepository mainQuestionRepository) {
    this.mainQuestionRepository = mainQuestionRepository;
  }

  @Override
  public List<MainQuestion> findAllQuestions() {
    return null;
  }

  @Override
  public MainQuestion findQuestionById(UUID questionId) {
    return null;
  }

  @Override
  public MainQuestion createQuestion(MainQuestion question) {
    return null;
  }

  @Override
  public MainQuestion updateQuestion(UUID questionId, MainQuestion question) {
    return null;
  }

  @Override
  public void deleteQuestion(UUID questionId) {

  }

  @Override
  public Subject addSubject(UUID questionId, UUID subjectId, Subject subject) {
    return null;
  }

  @Override
  public void removeSubject(UUID questionId, UUID subjectId) {

  }

  @Override
  public AdaptedQuestion addAdaptedQuestion(UUID questionId, UUID adaptedQuestionId,
      AdaptedQuestion question) {
    return null;
  }

  @Override
  public void removeAdaptedQuestion(UUID questionId, UUID adaptedQuestionId) {

  }

  @Override
  public MockExam addMockExam(UUID questionId, UUID mockExamId, MockExam mockExam) {
    return null;
  }

  @Override
  public void removeMockExam(UUID questionId, UUID mockExamId) {

  }

  @Override
  public Handout addHandout(UUID questionId, UUID handoutId, Handout handout) {
    return null;
  }

  @Override
  public void removeHandout(UUID questionId, UUID handoutId) {

  }
}
