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
import jakarta.persistence.OrderColumn;
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
  @ElementCollection
  @OrderColumn
  private List<MainQuestion> mockExamQuestions;

  public MockExam(
      String name,
      List<String> className,
      List<Subject> subjects,
      int number,
      List<MainQuestion> mockExamQuestions
  ) {
    this.name = name;
    this.className = className;
    this.subjects = subjects;
    this.number = number;
    this.mockExamQuestions = mockExamQuestions;
  }

  public static MockExam parseMockExam(MockExamInputDto examInputDto) {
    return new MockExam(
        examInputDto.name(),
        examInputDto.className(),
        new ArrayList<>(),
        examInputDto.number(),
        new ArrayList<>()
    );
  }

}
