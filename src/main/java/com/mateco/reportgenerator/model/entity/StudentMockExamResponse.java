package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students_mock_exam_response")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentMockExamResponse {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  private String name;

  private String email;

  private int correctAnswers;

  private int totalQuestions;

  @ElementCollection
  @CollectionTable(name="mock_exam_response_answers", joinColumns=@JoinColumn(name="exam_response_id"))
  @MapKeyColumn(name="answer_key")
  @Column(name="answer_value")
  private Map<Integer, String> answers;

  private String comment;

  private LocalDateTime createdAt;

  public StudentMockExamResponse(
      String name,
      String email,
      int totalQuestions,
      Map<Integer, String> answers,
      String comment,
      LocalDateTime createdAt
  ) {
    this.name = name;
    this.email = email;
    this.totalQuestions = totalQuestions;
    this.answers = answers;
    this.comment = comment;
    this.createdAt = createdAt;
  }

  public static List<StudentMockExamResponse> parseResponse(List<List<String>> studentsResponse) {
    return studentsResponse.stream()
        .map(studentResponse -> {
          DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yy H:mm");

          String name = studentResponse.get(3);
          String email = studentResponse.get(1);
          String createdAt = studentResponse.get(0);
          String comment = studentResponse.get(studentResponse.size() - 1);
          List<String> studentAnswers = studentResponse.subList(4, studentResponse.size() - 1);

          final int[] initialKey = {136};

          Map<Integer, String> answers = studentAnswers.stream()
              .collect(Collectors.toMap(
                  answer -> initialKey[0]++,
                  answer -> answer
              ));

          return new StudentMockExamResponse(
              name,
              email,
              studentAnswers.size(),
              answers,
              comment,
              LocalDateTime.parse(createdAt, formatter)
          );
        })
        .collect(Collectors.toList());
  }
}
