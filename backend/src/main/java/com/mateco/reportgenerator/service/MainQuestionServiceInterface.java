package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.Handout;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Question;
import com.mateco.reportgenerator.model.entity.Subject;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface - assinatura dos métodos para a camada service
 *                     da entidade MainQuestion.
 */
public interface MainQuestionServiceInterface {
  Page<MainQuestion> findAllMainQuestions(int pageNumber, int pageSize, String query);
  Page<MainQuestion> findAllFilteredMainQuestions(int pageNumber, int pageSize, String query, List<UUID> excludedQuestions);
  MainQuestion findMainQuestionById(UUID questionId);
  MainQuestion createMainQuestion(MainQuestion question, List<String> questionImages);
  MainQuestion updateMainQuestionById(UUID questionId, MainQuestion question, List<String> questionImages);
  void deleteMainQuestionById(UUID questionId);

  MainQuestion addSubject(UUID questionId, List<UUID> subjecstId);
  MainQuestion removeSubject(UUID questionId, List<UUID> subjectsId);

  MainQuestion addAdaptedQuestion(UUID questionId, AdaptedQuestion adaptedQuestion, List<String> questionImages);
  void removeAdaptedQuestion(UUID questionId, UUID adaptedQuestionId);
}
