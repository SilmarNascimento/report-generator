package com.mateco.reportgenerator.model.entity;

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
import java.util.List;
import java.util.Map;
import java.util.UUID;
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

  public List<Alternative> generateAnswers() {

    return new ArrayList<>();
  };
}
