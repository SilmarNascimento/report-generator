/*
package com.mateco.reportgenerator.controller;

import com.mateco.reportgenerator.model.entity.AdaptedQuestion;
import com.mateco.reportgenerator.model.entity.MainQuestion;
import com.mateco.reportgenerator.model.entity.MockExam;
import com.mateco.reportgenerator.model.entity.MockExamResponse;
import com.mateco.reportgenerator.model.repository.MockExamRepository;
import com.mateco.reportgenerator.service.FileServiceInterface;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/tests")
public class TesteController {
  private final FileServiceInterface fileService;

  @Autowired
  private MockExamRepository mockExamRepository;

  @Autowired
  public TesteController(FileServiceInterface fileService) {
    this.fileService = fileService;
  }

  @PostMapping("/mock-exam/{mockExamId}")
  public ResponseEntity<Object> xlsxReader(
      @RequestPart("studentsMockExamsAnswers") MultipartFile studentsAnswer,
      @RequestParam UUID mockExamId
  ) throws IOException {
    List<MockExamResponse> mockExamResponses= fileService.xlsxReader(studentsAnswer);
    System.out.println(mockExamResponses);

    function(mockExamResponses, mockExamId);

    return ResponseEntity.ok().body(mockExamResponses);
  }

  public void function(List<MockExamResponse> mockExamResponses, UUID mockExamId) {
    MockExam mockExamFound = mockExamRepository.findById(mockExamId)
        .orElseThrow(() -> new NotFoundException("Simulado não encontrado"));

    Map<Integer, String> map = new HashMap<>();
    map.put(0, "A");
    map.put(1, "B");
    map.put(2, "C");
    map.put(3, "D");
    map.put(4, "E");

    for (int index = 0; index < mockExamResponses.size(); index ++) {
      MockExamResponse studentResponse = mockExamResponses.get(index);
      studentResponse.setMockExam(mockExamFound);

      List<MainQuestion> mockExamQuestions = mockExamFound.getMockExamQuestions();
      List<String> studentAnswers = studentResponse.getResponses();
      List<List<AdaptedQuestion>> reportAdaptedQuestions = new ArrayList<>();

      for (int questionIndex = 0; questionIndex < mockExamQuestions.size(); questionIndex++) {
        MainQuestion mainQuestion = mockExamQuestions.get(questionIndex);

        int correctAlternativeIndex = IntStream.range(0, mainQuestion.getAlternatives().size())
            .filter(
                filterIndex -> mainQuestion.getAlternatives().get(filterIndex).isQuestionAnswer())
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Alternativa correta não encontrada"));

        if (map.get(correctAlternativeIndex).equals(studentAnswers.get(index))) {
          studentResponse.setCorrectAnswers(studentResponse.getCorrectAnswers() + 1);
        } else {
          List<AdaptedQuestion> adaptedQuestionList = mainQuestion.getAdaptedQuestions();
          reportAdaptedQuestions.add(adaptedQuestionList);
        }
      }

      studentResponse.setAdaptedQuestionList(reportAdaptedQuestions);
    }
  }
}


  mockExamQuestions.forEach(mainQuestion -> {
        int correctAlternativeIndex = IntStream.range(0, mainQuestion.getAlternatives().size())
            .filter(filterIndex -> mainQuestion.getAlternatives().get(filterIndex).isQuestionAnswer())
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Alternativa correta não encontrada"));

        if (map.get(correctAlternativeIndex).equals(studentAnswers.get(index))) {
          correctAnswers[0]++;
        } else {
          List<AdaptedQuestion> adaptedQuestionList = mockExamQuestions.get(key - 136).getAdaptedQuestions();
          reportQuestions.put(key, adaptedQuestionList);
        }

      });

    mockExamResponses.stream().forEach(studentResponse -> {
      studentResponse.setMockExam(mockExamFound);

      List<MainQuestion> mockExamQuestions = mockExamFound.getMockExamQuestions();
      List<String> studentAnswers = studentResponse.getAnswers();
      List<List<AdaptedQuestion>> reportAdaptedQuestions = new ArrayList<>();

    mockExamQuestions.forEach(mainQuestion -> {
      int correctAlternativeIndex = IntStream.range(0, mainQuestion.getAlternatives().size())
          .filter(index -> mainQuestion.getAlternatives().get(index).isQuestionAnswer())
          .findFirst()
          .orElseThrow(() -> new NotFoundException("Alternativa correta não encontrada"));

      if (map.get(correctAlternativeIndex).equals(studentAnswers.get(key))) {
        correctAnswers[0]++;
      } else {
        List<AdaptedQuestion> adaptedQuestionList = mockExamQuestions.get(key - 136).getAdaptedQuestions();
        reportQuestions.put(key, adaptedQuestionList);
      }

    });

    });
    // List<MainQuestion> mockExamQuestions = mockExamFound.getMockExamQuestions();
    // Map<Integer, String> studentAnswers = studentMockExamResponse.getAnswers();
    // Map<Integer, List<AdaptedQuestion>> reportQuestions = new HashMap<>();

    final int[] correctAnswers = {0};

    gabarito.keySet().forEach((Integer key) -> {
      if (gabarito.get(key).equals(studentAnswers.get(key))) {
        correctAnswers[0]++;
      } else {
        List<AdaptedQuestion> adaptedQuestionList = mockExamQuestions.get(key - 136).getAdaptedQuestions();
        reportQuestions.put(key, adaptedQuestionList);
      }
    });

    studentMockExamResponse.setCorrectAnswers(correctAnswers[0]);
    studentMockExamResponse.setAdaptedQuestionList(reportQuestions);


    public List<String> generateAnswers() {
    List<MainQuestion> questions = this.mockExamQuestions;

    return questions.stream()
        .map(question -> generateAlternativeLetter(question))
        .collect(Collectors.toList());
  };

  private String generateAlternativeLetter(MainQuestion question) {
    List<Alternative> alternativeList = question.getAlternatives();

    int index = 0;
    for (Alternative alternative: alternativeList) {
      if (alternative.isQuestionAnswer()) {
        break;
      }
      index ++;
    }

    Map<Integer, String> map = new HashMap<>();
    map.put(0, "A");
    map.put(1, "B");
    map.put(2, "C");
    map.put(3, "D");
    map.put(4, "E");

    return map.getOrDefault(index, "");
  }
 */
