package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.util.List;
import java.util.UUID;

public interface MockExamServiceInterface {

  List<MockExam> findAllMockExams();

  MockExam findMockExamById(UUID mockExamId);

  MockExam createMockExam(MockExam mockExam);

  MockExam updateMockExamById(UUID mockExamId, MockExam mockExam);

  void deleteMockExamById(UUID mockExamId);

  MockExam addSubject(UUID mockExamId, List<UUID> subjecstId);

  void removeSubject(UUID mockExamId, List<UUID> subjectsId);

  MockExam addMainQuestion(UUID mockExamId, List<UUID> mainQuestionsId);
  void removeMainQuestion(UUID mockExamId, List<UUID> mainQuestionId);

  List<MockExamResponse> registerAllMockExamResponses(List<MockExamResponse> mockExamResponses, UUID mockExamId);
}
