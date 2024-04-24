package com.mateco.reportgenerator.model.entity;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamInputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionOutputDto;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mock_exams")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MockExam {
  public static final int INITIAL_QUESTION_NUMBER = 136;

  public static final int MAXIMUM_QUESTIONS_NUMBER = 45;

  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  private String name;

  private List<String> className;

  @ManyToMany
  @JoinTable(
      name = "mock_exams_content",
      joinColumns = @JoinColumn(name = "subject_id"),
      inverseJoinColumns = @JoinColumn(name = "mock_exam_id")
  )
  private List<Subject> subjects;

  private int releasedYear;

  private int number;

  @ManyToMany
  @JoinTable(
      name = "mock_exams_questions",
      joinColumns = @JoinColumn(name = "main_question_id"),
      inverseJoinColumns = @JoinColumn(name = "mock_exam_id")
  )
  private Map<Integer, MainQuestion> mockExamQuestions;

  public MockExam(
      String name,
      List<String> className,
      List<Subject> subjects,
      int releasedYear,
      int number
  ) {
    this.name = name;
    this.className = className;
    this.subjects = subjects;
    this.releasedYear = releasedYear;
    this.number = number;
    this.mockExamQuestions = mainQuestionsInitializer();
  }

  public static MockExam parseMockExam(MockExamInputDto examInputDto) {
    return new MockExam(
        examInputDto.name(),
        examInputDto.className(),
        new ArrayList<>(),
        examInputDto.releasedYear(),
        examInputDto.number()
    );
  }

  private static Map<Integer, MainQuestion> mainQuestionsInitializer () {
    int initialNumber = MockExam.INITIAL_QUESTION_NUMBER;
    int lastNumber = initialNumber + MockExam.MAXIMUM_QUESTIONS_NUMBER;

    Map<Integer, MainQuestion> mainQuestionsExam = new HashMap<>();
    for (int index = initialNumber; index < lastNumber; index ++) {
      mainQuestionsExam.put(index, null);
    }

    return mainQuestionsExam;
  }

  public List<Integer> findAllAvailableSlots() {
    return this.getMockExamQuestions().entrySet().stream()
        .filter(entry -> entry.getValue() == null)
        .map(Map.Entry::getKey)
        .collect(Collectors.toList());
  }

}
