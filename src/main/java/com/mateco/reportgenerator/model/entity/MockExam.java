package com.mateco.reportgenerator.model.entity;

import com.mateco.reportgenerator.controller.dto.MockExamInputDto;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mock_exams")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MockExam {
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

  private int number;

  @ManyToMany
  @JoinTable(
      name = "mock_exams_questions",
      joinColumns = @JoinColumn(name = "main_question_id"),
      inverseJoinColumns = @JoinColumn(name = "mock_exam_id")
  )
  private List<MainQuestion> mockExamQuestions;

  @ElementCollection
  @CollectionTable(name="mock_exam_response_answers", joinColumns=@JoinColumn(name="mock_exam_id"))
  @MapKeyColumn(name="answer_key")
  @Column(name="answer_value")
  private Map<Integer, String> answers;

  public MockExam(
      String name,
      List<String> className,
      List<Subject> subjects,
      int number,
      List<MainQuestion> mockExamQuestions,
      Map<Integer, String> answers
  ) {
    this.name = name;
    this.className = className;
    this.subjects = subjects;
    this.number = number;
    this.mockExamQuestions = mockExamQuestions;
    this.answers = answers;
  }

  public static MockExam parseMockExam(MockExamInputDto examInputDto) {
    return new MockExam(
        examInputDto.name(),
        examInputDto.className(),
        new ArrayList<>(),
        examInputDto.number(),
        new ArrayList<>(),
        new HashMap<>()
    );
  }

  public Map<Integer, String> generateAnswers() {
    List<MainQuestion> questions = this.mockExamQuestions;

    final int[] initialKey = {136};

    return questions.stream()
        .collect(Collectors.toMap(
            question -> initialKey[0]++,
            question -> generateAlternativeLetter(question)
        ));
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
}
