package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.model.entity.FileEntity;
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
import com.mateco.reportgenerator.service.exception.InvalidDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import com.mateco.reportgenerator.utils.UpdateEntity;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MockExamService implements MockExamServiceInterface {
  private final MockExamRepository mockExamRepository;
  private final MainQuestionRepository mainQuestionRepository;
  private final SubjectRepository subjectRepository;
  private final MockExamResponseRepository mockExamResponseRepository;

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
  public MockExam createMockExam(
      MockExam mockExam,
      MultipartFile coverPdfFile,
      MultipartFile matrixPdfFile,
      MultipartFile answersPdfFile
  ) throws IOException {
    addFileEntityIfPresent(mockExam, coverPdfFile, matrixPdfFile, answersPdfFile);

    return mockExamRepository.save(mockExam);
  }

  @Override
  public MockExam updateMockExamById(
      UUID mockExamId,
      MockExam mockExam,
      MultipartFile coverPdfFile,
      MultipartFile matrixPdfFile,
      MultipartFile answersPdfFile
  ) throws IOException {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));

    addFileEntityIfPresent(mockExam, coverPdfFile, matrixPdfFile, answersPdfFile);

    UpdateEntity.copyNonNullOrListProperties(mockExam, mockExamFound);

    return mockExamRepository.save(mockExamFound);
  }

  @Override
  public void deleteMockExamById(UUID mockExamId) {
    mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));

    mockExamRepository.deleteById(mockExamId);
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

  @Override
  @Transactional
  public List<MockExamResponse> registerAllMockExamResponses(UUID mockExamId, List<MockExamResponse> mockExamResponses) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado!"));

    if (mockExamFound.getMockExamQuestions().size() != 45) {
      throw new InvalidDataException("O simulado não contém 45 questões");
    }

    Map<Integer, String> answerMap = new HashMap<>();
    answerMap.put(0, "A");
    answerMap.put(1, "B");
    answerMap.put(2, "C");
    answerMap.put(3, "D");
    answerMap.put(4, "E");

    List<Integer> punishmentLevels = List.of(1, 2, 5);

    for (MockExamResponse studentResponse : mockExamResponses) {
      studentResponse.setMockExam(mockExamFound);

      Map<Integer, MainQuestion> mockExamQuestions = mockExamFound.getMockExamQuestions();
      List<String> studentAnswers = studentResponse.getResponses();

      double totalWeightAllQuestions = 0.0;
      double totalAchievedWeight = 0.0;
      double maxWeightPunishmentLevels = 0.0;
      double achievedWeightPunishmentLevels = 0.0;

      Map<String, int[]> areaStats = new HashMap<>();
      Map<String, int[]> difficultyStats = new HashMap<>();
      Map<Subject, int[]> subjectStats = new HashMap<>();
      Map<Subject, Double> subjectTotalWeight = new HashMap<>();
      Map<Subject, Double> subjectErrorWeight = new HashMap<>();

      for (int questionIndex = 0; questionIndex < mockExamQuestions.size(); questionIndex++) {
        int questionNumber = questionIndex + MockExam.INITIAL_QUESTION_NUMBER;
        MainQuestion mainQuestion = mockExamQuestions.get(questionNumber);

        int questionWeight = mainQuestion.getWeight();
        int lerickucasLevel = mainQuestion.getLerickucas();
        String area = mainQuestion.getPattern().name().toUpperCase();
        String level = mainQuestion.getLevel().toUpperCase();

        Subject primarySubject = (mainQuestion.getSubjects() != null && !mainQuestion.getSubjects().isEmpty())
                ? mainQuestion.getSubjects().get(0) : null;

        totalWeightAllQuestions += questionWeight;
        if (punishmentLevels.contains(lerickucasLevel)) {
          maxWeightPunishmentLevels += questionWeight;
        }

        areaStats.putIfAbsent(area, new int[2]);
        difficultyStats.putIfAbsent(level, new int[2]);
        areaStats.get(area)[1]++;
        difficultyStats.get(level)[1]++;



        int correctAlternativeIndex = IntStream.range(0, mainQuestion.getAlternatives().size())
            .filter(filterIndex -> mainQuestion
                .getAlternatives().get(filterIndex).isQuestionAnswer())
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Alternativa correta não encontrada!"));

        boolean isCorrect = answerMap.get(correctAlternativeIndex).equals(studentAnswers.get(questionIndex));

        if (primarySubject != null) {
          subjectTotalWeight.put(primarySubject, subjectTotalWeight.getOrDefault(primarySubject, 0.0) + questionWeight);

          subjectStats.putIfAbsent(primarySubject, new int[2]);
          subjectStats.get(primarySubject)[1]++;

          if (isCorrect) {
            subjectStats.get(primarySubject)[0]++;
          }
        }

        if (isCorrect) {
          studentResponse.setCorrectAnswers(studentResponse.getCorrectAnswers() + 1);

          totalAchievedWeight += questionWeight;
          if (punishmentLevels.contains(lerickucasLevel)) {
            achievedWeightPunishmentLevels += questionWeight;
          }
          areaStats.get(area)[0]++;
          difficultyStats.get(level)[0]++;
        } else {
          studentResponse.getMissedMainQuestionNumbers().add(questionNumber);

          if (primarySubject != null) {
            subjectErrorWeight.put(primarySubject, subjectErrorWeight.getOrDefault(primarySubject, 0.0) + questionWeight);
          }

          if ("FÁCIL".equals(level)) {
            studentResponse.getEasyMissedQuestions().add(questionNumber);
          } else if ("DIFÍCIL".equals(level)) {
            studentResponse.getHardMissedQuestions().add(questionNumber);
          }
        }
      }

      calculateAndSetIpm(
        studentResponse,
        totalWeightAllQuestions,
        totalAchievedWeight,
        maxWeightPunishmentLevels,
        achievedWeightPunishmentLevels
      );

      studentResponse.setAreaPerformance(formatPerformanceMap(areaStats));
      studentResponse.setDifficultyPerformance(formatPerformanceMap(difficultyStats));
      studentResponse.setTop5SubjectsPerformance(calculateTop5Subjects(subjectStats));
      studentResponse.setSubjectsToReview(calculateRevisionPriorities(subjectTotalWeight, subjectErrorWeight));

    }

    return mockExamResponseRepository.saveAll(mockExamResponses);
  }

  private List<String> calculateRevisionPriorities(
          Map<Subject, Double> subjectTotalWeight,
          Map<Subject, Double> subjectErrorWeight
  ) {
    Map<Subject, Double> priorityIndices = new HashMap<>();

    subjectTotalWeight.forEach((subject, totalWeight) -> {
      double errorWeight = subjectErrorWeight.getOrDefault(subject, 0.0);

      double errorRate = errorWeight / totalWeight;

      priorityIndices.put(subject, totalWeight * errorRate);
    });

    return priorityIndices.entrySet().stream()
            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
            .limit(3)
            .map(entry -> entry.getKey().getName())
            .collect(Collectors.toList());
  }

  private Map<String, String> formatPerformanceMap(Map<String, int[]> stats) {
    Map<String, String> formatted = new HashMap<>();
    stats.forEach((key, val) -> {
      double percent = (val[1] > 0) ? ((double) val[0] / val[1]) * 100 : 0;
      formatted.put(key, String.format("%d de %d (%d%%)", val[0], val[1], (int) Math.round(percent)));
    });
    return formatted;
  }

  private Map<String, String> calculateTop5Subjects(Map<Subject, int[]> subjectStats) {
    return subjectStats.entrySet().stream()
            .sorted((a, b) -> {
              int compareCount = Integer.compare(b.getValue()[1], a.getValue()[1]); // 1º: Maior quantidade
              if (compareCount == 0) {
                return a.getKey().getName().compareTo(b.getKey().getName()); // 2º: Ordem alfabética
              }
              return compareCount;
            })
            .limit(5)
            .collect(Collectors.toMap(
                    entry -> entry.getKey().getName(),
                    entry -> String.format("%d de %d", entry.getValue()[0], entry.getValue()[1]),
                    (v1, v2) -> v1,
                    LinkedHashMap::new
            ));
  }

  private static void addFileEntityIfPresent(
      MockExam mockExam,
      MultipartFile coverPdfFile,
      MultipartFile matrixPdfFile,
      MultipartFile asnwersPdfFile
  ) throws IOException {
    if (coverPdfFile != null) {
      mockExam.setCoverPdfFile(new FileEntity(coverPdfFile));
    }
    if (matrixPdfFile != null) {
      mockExam.setMatrixPdfFile(new FileEntity(matrixPdfFile));
    }
    if (asnwersPdfFile != null) {
      mockExam.setAnswersPdfFile(new FileEntity(asnwersPdfFile));
    }
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

  private void calculateAndSetIpm(
          MockExamResponse studentResponse,
          double A_totalWeight,
          double sumIcpTotal,
          double B_maxWeightPunishment,
          double C_achievedWeightPunishment
  ) {
    if (A_totalWeight == 0) {
      studentResponse.setIpmScore(0.0);
      studentResponse.setIcpPrevious(0.0);
      studentResponse.setPunishmentScore(0.0);
      return;
    }

    double icpPrevious = (sumIcpTotal / A_totalWeight) * 100.0;

    double punishmentPercent = 0.0;

    if (B_maxWeightPunishment > 0) {
      double consistencyFactor = 1.0 - (C_achievedWeightPunishment / B_maxWeightPunishment);
      double weightFactor = B_maxWeightPunishment / A_totalWeight;

      punishmentPercent = (consistencyFactor * weightFactor) * 100.0;
    }

    double finalIpm = icpPrevious - punishmentPercent;

    studentResponse.setIcpPrevious((double) Math.round(icpPrevious));
    studentResponse.setPunishmentScore((double) Math.round(punishmentPercent));
    studentResponse.setIpmScore((double) Math.round(Math.max(0, finalIpm)));
  }

}
