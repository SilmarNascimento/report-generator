package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Question;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;

/**
 * Service Interface - assinatura dos métodos para a camada service
 *                     da entidade MainQuestion.
 */
public interface MainQuestionServiceInterface {
  List<MainQuestion> findAllMainQuestions();
  MainQuestion findMainQuestionById(UUID questionId);
  MainQuestion createMainQuestion(MainQuestion question, List<String> questionImages);
  MainQuestion updateMainQuestionById(UUID questionId, MainQuestion question);
  void deleteMainQuestionById(UUID questionId);

  MainQuestion addSubject(UUID questionId, List<UUID> subjecstId);
  void removeSubject(UUID questionId, List<UUID> subjectsId);

  MainQuestion addAdaptedQuestion(UUID questionId, AdaptedQuestion adaptedQuestion, List<String> questionImages);
  void removeAdaptedQuestion(UUID questionId, UUID adaptedQuestionId);
}
