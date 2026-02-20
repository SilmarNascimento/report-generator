package com.mateco.reportgenerator.service;

import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface MockExamServiceInterface {

  Page<MockExam> findAllMockExams(int pageNumber, int pageSize);

  MockExam findMockExamById(UUID mockExamId);

  MockExam createMockExam(MockExam mockExam, MultipartFile coverPdfFile, MultipartFile matrixPdfFile, MultipartFile answersPdfFile) throws IOException;

  MockExam updateMockExamById(UUID mockExamId, MockExam mockExam, MultipartFile coverPdfFile, MultipartFile matrixPdfFile, MultipartFile answersPdfFile) throws IOException;

  void deleteMockExamById(UUID mockExamId);

  MockExam addSubject(UUID mockExamId, List<UUID> subjecstId);

  MockExam removeSubject(UUID mockExamId, List<UUID> subjectsId);

  MockExam addMainQuestion(UUID mockExamId, List<UUID> mainQuestionsId);

  MockExam removeMainQuestion(UUID mockExamId, List<UUID> mainQuestionId);

  List<MockExamResponse> registerAllMockExamResponses(UUID mockExamId, List<MockExamResponse> mockExamResponses);
}
