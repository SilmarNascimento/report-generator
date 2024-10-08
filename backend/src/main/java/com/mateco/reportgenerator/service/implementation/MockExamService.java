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
import java.util.stream.Collectors;
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
    System.out.println(mockExam);
    return mockExamRepository.save(mockExam);
  }

  @Override
  public MockExam updateMockExamById(UUID mockExamId, MockExam mockExam) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));

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

    List<MainQuestion> mainQuestionListToAdd = mainQuestionRepository.findAllById(mainQuestionsId);
    if (mainQuestionListToAdd.isEmpty()) {
      throw new NotFoundException("Nenhuma questão principal foi encontrada com os IDs fornecidos!");
    }

    Map<Integer, MainQuestion> mainQuestionMap = mockExamFound.getMockExamQuestions();

    verifyAvailability(mainQuestionMap, mainQuestionListToAdd);
    verifyDuplicity(mainQuestionListToAdd, mainQuestionMap);

    addMainQuestionsToMockExamMap(mainQuestionMap, mainQuestionListToAdd);
    mockExamFound.setMockExamQuestions(mainQuestionMap);

    return mockExamRepository.save(mockExamFound);
  }

  @Override
  @Transactional
  public MockExam removeMainQuestion(UUID mockExamId, List<UUID> mainQuestionsId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado!"));

    List<MainQuestion> mainQuestionListToDelete = mainQuestionRepository.findAllById(mainQuestionsId);
    if (mainQuestionListToDelete.isEmpty()) {
      throw new NotFoundException("Nenhuma questão principal foi encontrada com os IDs fornecidos!");
    }

    Map<Integer, MainQuestion> mainQuestionMap = mockExamFound.getMockExamQuestions();
    List<Integer> questionsNumber = findDuplicateQuestionNumber(mainQuestionListToDelete, mainQuestionMap);
    if (questionsNumber.size() == mainQuestionsId.size()) {
      questionsNumber.forEach(mainQuestionMap::remove);
    } else {
      throw new ConflictDataException("Questão principal não está presente no simulado");
    }

    return mockExamRepository.save(mockExamFound);
  }

  public List<MockExamResponse> registerAllMockExamResponses(UUID mockExamId, List<MockExamResponse> mockExamResponses) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado!"));

    Map<Integer, String> answerMap = new HashMap<>();
    answerMap.put(0, "A");
    answerMap.put(1, "B");
    answerMap.put(2, "C");
    answerMap.put(3, "D");
    answerMap.put(4, "E");

    for (MockExamResponse studentResponse : mockExamResponses) {
      studentResponse.setMockExam(mockExamFound);

      Map<Integer, MainQuestion> mockExamQuestions = mockExamFound.getMockExamQuestions();
      List<String> studentAnswers = studentResponse.getResponses();
      List<AdaptedQuestionWrapper> reportAdaptedQuestions = new ArrayList<>();

      for (int questionIndex = 0; questionIndex < mockExamQuestions.size(); questionIndex++) {
        MainQuestion mainQuestion = mockExamQuestions.get(questionIndex + MockExam.INITIAL_QUESTION_NUMBER);
        int correctAlternativeIndex = IntStream.range(0, mainQuestion.getAlternatives().size())
            .filter(filterIndex -> mainQuestion
                .getAlternatives().get(filterIndex).isQuestionAnswer())
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Alternativa correta não encontrada!"));

        if (answerMap.get(correctAlternativeIndex).equals(studentAnswers.get(questionIndex))) {
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

  private static List<Integer> findDuplicateQuestionNumber(
      List<MainQuestion> mainQuestions,
      Map<Integer, MainQuestion> questionMap
  ) {
    Map<UUID, Integer> reverseMap = new HashMap<>();
    for (Map.Entry<Integer, MainQuestion> entry : questionMap.entrySet()) {
      reverseMap.put(entry.getValue().getId(), entry.getKey());
    }

    List<Integer> duplicatedQuestions = new ArrayList<>();
    for (MainQuestion mainQuestion : mainQuestions) {
      if (reverseMap.containsKey(mainQuestion.getId())) {
        duplicatedQuestions.add(reverseMap.get(mainQuestion.getId()));
      }
    }

    return duplicatedQuestions;
  }

  private static void verifyDuplicity(
      List<MainQuestion> mainQuestionListToAdd,
      Map<Integer, MainQuestion> mainQuestionMap
  ) {
    List<Integer> duplicatedQuestions = findDuplicateQuestionNumber(
        mainQuestionListToAdd,
        mainQuestionMap
    );
    if (!duplicatedQuestions.isEmpty()) {
      throw new ConflictDataException("Tentativa de adicionar questões principais duplicadas");
    }
  }

  private static void verifyAvailability(
      Map<Integer, MainQuestion> mainQuestionMap,
      List<MainQuestion> mainQuestionListToAdd
  ) {
    int availableSlots = MockExam.MAXIMUM_QUESTIONS_NUMBER - mainQuestionMap.size();
    if (availableSlots <= 0  || availableSlots < mainQuestionListToAdd.size()) {
      throw new ConflictDataException("Limite máximo de questões principais atingido para o Simulado!");
    }
  }

  private static void addMainQuestionsToMockExamMap(
      Map<Integer, MainQuestion> mainQuestionMap,
      List<MainQuestion> mainQuestionListToAdd
  ) {
    int start = MockExam.INITIAL_QUESTION_NUMBER;
    int end = start + MockExam.MAXIMUM_QUESTIONS_NUMBER - 1;
    Set<Integer> questionNumberSet = IntStream.rangeClosed(start, end)
        .boxed()
        .collect(Collectors.toCollection(HashSet::new));
    Set<Integer> unavailableSlots = mainQuestionMap.keySet();
    questionNumberSet.removeAll(unavailableSlots);
    List<Integer> availableSlotsNumber = new ArrayList<>(questionNumberSet);

    for (int index = 0; index < mainQuestionListToAdd.size(); index ++) {
      Integer availableQuestionNumber = availableSlotsNumber.get(index);
      MainQuestion mainQuestionToAdd = mainQuestionListToAdd.get(index);

      mainQuestionMap.put(availableQuestionNumber, mainQuestionToAdd);
    }
  }

}
