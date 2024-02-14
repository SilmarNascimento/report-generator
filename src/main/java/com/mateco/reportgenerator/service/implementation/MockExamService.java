package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.MockExamRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MockExamService implements MockExamServiceInterface {
  private final MockExamRepository mockExamRepository;
  private final MainQuestionRepository mainQuestionRepository;
  private final SubjectRepository subjectRepository;

  @Autowired
  public MockExamService(MockExamRepository mockExamRepository,
      MainQuestionRepository mainQuestionRepository, SubjectRepository subjectRepository) {
    this.mockExamRepository = mockExamRepository;
    this.mainQuestionRepository = mainQuestionRepository;
    this.subjectRepository = subjectRepository;
  }

  @Override
  public List<MockExam> findAllMockExams() {
    return mockExamRepository.findAll();
  }

  @Override
  public MockExam findMockExamById(UUID mockExamId) {
    return mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));
  }

  @Override
  public MockExam createMockExam(MockExam mockExam) {
    return mockExamRepository.save(mockExam);
  }

  @Override
  public MockExam updateMockExamById(UUID mockExamId, MockExam mockExam) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));

    UpdateEntity.copyNonNullProperties(mockExam, mockExamFound);

    return mockExamRepository.save(mockExamFound);
  }

  @Override
  public void deleteMockExamById(UUID mockExamId) {
    // acho melhor deixar em estado de desativado!
  }

  @Override
  public MockExam addSubject(UUID mockExamId, List<UUID> subjecstId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));

    List<Subject> subjectListToAdd = subjectRepository.findAllById(subjecstId);
    if (subjectListToAdd.isEmpty()) {
      throw new NotFoundException("Nenhum assunto encontrado com os IDs fornecidos!");
    }

    Set<Subject> previousSubjectSet = new HashSet<>(mockExamFound.getSubjects());
    previousSubjectSet.addAll(subjectListToAdd);
    mockExamFound.setSubjects(new ArrayList<>(previousSubjectSet));

    return mockExamRepository.save(mockExamFound);
  }

  @Override
  public void removeSubject(UUID mockExamId, List<UUID> subjectsId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));

    mockExamFound.getSubjects().removeIf(subject -> subjectsId.contains(subject.getId()));

    mockExamRepository.save(mockExamFound);
  }

  @Override
  public MockExam addMainQuestion(UUID mockExamId, List<UUID> mainQuestionsId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));

    List<MainQuestion> mainQuestionListToAdd = mainQuestionRepository.findAllById(mainQuestionsId);
    if (mainQuestionListToAdd.isEmpty()) {
      throw new NotFoundException("Nenhuma questão principal foi encontrada com os IDs fornecidos!");
    }

    Set<MainQuestion> previousMainQuestionSet = new HashSet<>(mockExamFound.getMockExamQuestions());
    previousMainQuestionSet.addAll(mainQuestionListToAdd);
    mockExamFound.setMockExamQuestions(new ArrayList<>(previousMainQuestionSet));

    return mockExamRepository.save(mockExamFound);
  }

  @Override
  public void removeMainQuestion(UUID mockExamId, List<UUID> mainQuestionsId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));

    mockExamFound.getMockExamQuestions().removeIf(mainQuestion -> mainQuestionsId.contains(mainQuestion.getId()));

    mockExamRepository.save(mockExamFound);
  }
}
