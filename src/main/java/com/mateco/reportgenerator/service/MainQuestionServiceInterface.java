package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import java.util.List;
import java.util.UUID;

public interface MainQuestionServiceInterface {
  List<MainQuestion> findAllQuestions();
  MainQuestion findQuestionById(UUID questionId);
  MainQuestion createQuestion(MainQuestion question);
  MainQuestion updateQuestion(UUID questionId, MainQuestion question);
  void deleteQuestion(UUID questionId);
  AdaptedQuestion addAdaptedQuestion(UUID questionId, UUID adaptedQuestionId, AdaptedQuestion question);
  void removeAdaptedQuestion(UUID questionId, UUID adaptedQuestionId);
  MockExam addMockExam(UUID questionId, UUID mockExamId, MockExam mockExam);
  void removeMockExam(UUID questionId, UUID mockExamId);
  Handout addHandout(UUID questionId, UUID handoutId, Handout handout);
  void removeHandout(UUID questionId, UUID handoutId);
}