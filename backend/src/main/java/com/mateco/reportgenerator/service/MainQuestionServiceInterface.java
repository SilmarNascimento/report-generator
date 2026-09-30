package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;

/**
 * Service Interface - assinatura dos métodos para a camada service
 *                     da entidade MainQuestion.
 */
public interface MainQuestionServiceInterface {
  Page<MainQuestion> findAllMainQuestions(int pageNumber, int pageSize, String query);
  Page<MainQuestion> findAllFilteredMainQuestions(int pageNumber, int pageSize, String query, List<UUID> excludedQuestions);
  MainQuestion findMainQuestionById(UUID questionId);
  MainQuestion createMainQuestion(MainQuestion question, UUID mainSubjectId, List<UUID> secondarySubjectsId);
  MainQuestion updateMainQuestionById(UUID questionId, MainQuestion question, UUID mainSubjectId, List<UUID> secondarySubjectsId);
  void deleteMainQuestionById(UUID questionId);
  void deleteAllMainQuestionsByIds(List<UUID> ids);

  MainQuestion addSubject(UUID questionId, List<UUID> subjecstId);
  MainQuestion removeSubject(UUID questionId, List<UUID> subjectsId);

  MainQuestion addAdaptedQuestion(UUID questionId, AdaptedQuestion adaptedQuestion, List<String> questionImages);
  void removeAdaptedQuestion(UUID questionId, UUID adaptedQuestionId);
}
