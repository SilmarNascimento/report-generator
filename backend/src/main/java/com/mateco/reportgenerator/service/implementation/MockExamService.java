package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.AdaptedQuestionWrapper;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.model.entity.Subject;
import com.mateco.reportgenerator.model.repository.MainQuestionRepository;
import com.mateco.reportgenerator.model.repository.MockExamRepository;
import com.mateco.reportgenerator.model.repository.MockExamResponseRepository;
import com.mateco.reportgenerator.model.repository.SubjectRepository;
import com.mateco.reportgenerator.service.MockExamServiceInterface;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.IntStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MockExamService implements MockExamServiceInterface {
  private final MockExamRepository mockExamRepository;
  private final MainQuestionRepository mainQuestionRepository;
  private final SubjectRepository subjectRepository;
  private final MockExamResponseRepository mockExamResponseRepository;

  @Autowired
  public MockExamService(
      MockExamRepository mockExamRepository,
      MainQuestionRepository mainQuestionRepository,
      SubjectRepository subjectRepository,
      MockExamResponseRepository mockExamResponseRepository
  ) {
    this.mockExamRepository = mockExamRepository;
    this.mainQuestionRepository = mainQuestionRepository;
    this.subjectRepository = subjectRepository;
    this.mockExamResponseRepository = mockExamResponseRepository;
  }

  @Override
  public Page<MockExam> findAllMockExams(int pageNumber, int pageSize) {
    Pageable pageable = PageRequest.of(pageNumber, pageSize);
    return mockExamRepository.findAll(pageable);
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

    mockExamFound.setSubjects(mockExam.getSubjects());

    UpdateEntity.copyNonNullOrListProperties(mockExam, mockExamFound);

    return mockExamRepository.save(mockExamFound);
  }

  @Override
  public void deleteMockExamById(UUID mockExamId) {
    // acho melhor deixar em estado de desativado!
  }

  @Override
  public MockExam addSubject(UUID mockExamId, List<UUID> subjecstId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado!"));

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
  public MockExam removeSubject(UUID mockExamId, List<UUID> subjectsId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado!"));

    mockExamFound.getSubjects().removeIf(subject -> subjectsId.contains(subject.getId()));

    return mockExamRepository.save(mockExamFound);
  }

  @Override
  @Transactional
  public MockExam addMainQuestion(UUID mockExamId, List<UUID> mainQuestionsId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado!"));

    Set<MainQuestion> previousMainQuestionSet = new HashSet<>(mockExamFound.getMockExamQuestions());
    int nextQuestionNumber = previousMainQuestionSet.size() + MockExam.INITIAL_QUESTION_NUMBER;

    List<MainQuestion> mainQuestionListToAdd = mainQuestionRepository.findAllById(mainQuestionsId);
    if (mainQuestionListToAdd.isEmpty()) {
      throw new NotFoundException("Nenhuma questão principal foi encontrada com os IDs fornecidos!");
    }

    for (MainQuestion question : mainQuestionListToAdd) {
      if (previousMainQuestionSet.size() >= MockExam.MAXIMUM_QUESTIONS_NUMBER) {
        throw new ConflictDataException("Limite máximo de questões principais atingido para o Simulado!");
      }

      if (!previousMainQuestionSet.contains(question)) {
        question.setQuestionNumber(nextQuestionNumber);
        previousMainQuestionSet.add(question);
        nextQuestionNumber++;
      }
    }

    mockExamFound.setMockExamQuestions(new ArrayList<>(previousMainQuestionSet));

    return mockExamRepository.save(mockExamFound);
  }

  @Override
  public MockExam removeMainQuestion(UUID mockExamId, List<UUID> mainQuestionsId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado!"));

    mockExamFound.getMockExamQuestions().removeIf(mainQuestion -> mainQuestionsId.contains(mainQuestion.getId()));

    return mockExamRepository.save(mockExamFound);
  }

  public List<MockExamResponse> registerAllMockExamResponses(UUID mockExamId, List<MockExamResponse> mockExamResponses) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado!"));

    Map<Integer, String> map = new HashMap<>();
    map.put(0, "A");
    map.put(1, "B");
    map.put(2, "C");
    map.put(3, "D");
    map.put(4, "E");

    for (MockExamResponse studentResponse : mockExamResponses) {
      studentResponse.setMockExam(mockExamFound);

      List<MainQuestion> mockExamQuestions = mockExamFound.getMockExamQuestions();
      List<String> studentAnswers = studentResponse.getResponses();
      List<AdaptedQuestionWrapper> reportAdaptedQuestions = new ArrayList<>();

      for (int questionIndex = 0; questionIndex < mockExamQuestions.size(); questionIndex++) {
        MainQuestion mainQuestion = mockExamQuestions.get(questionIndex);
        int correctAlternativeIndex = IntStream.range(0, mainQuestion.getAlternatives().size())
            .filter(filterIndex -> mainQuestion
                .getAlternatives().get(filterIndex).isQuestionAnswer())
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Alternativa correta não encontrada!"));

        if (map.get(correctAlternativeIndex).equals(studentAnswers.get(questionIndex))) {
          studentResponse.setCorrectAnswers(studentResponse.getCorrectAnswers() + 1);
        } else {
          List<AdaptedQuestion> adaptedQuestionList = mainQuestion.getAdaptedQuestions();
          reportAdaptedQuestions.add(new AdaptedQuestionWrapper(
              mainQuestion.getId(),
              adaptedQuestionList
          ));
        }
      }

      studentResponse.setAdaptedQuestionList(reportAdaptedQuestions);
    }

    return mockExamResponseRepository.saveAll(mockExamResponses);
  }
}
