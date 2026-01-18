package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mock_exam_response")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MockExamResponse {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  private String name;

  private String email;

  @ManyToOne
  @JoinColumn(name = "mock_exam_id")
  private MockExam mockExam;

  private int correctAnswers;

  private int totalQuestions;

  @Column(name = "ipm_score")
  private Double ipmScore;

  @Column(name = "icp_previous")
  private Double icpPrevious;

  @Column(name = "punishment_score")
  private Double punishmentScore;

  @ElementCollection
  @OrderColumn
  private List<String> responses;

  private List<Integer> missedMainQuestionNumbers;

  @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "diagnosis_file_id")
  private FileEntity diagnosisPdfFile;

  @Column(columnDefinition = "VARCHAR(1000)")
  private String comment;

  private LocalDateTime createdAt;

  public MockExamResponse(
      String name,
      String email,
      int totalQuestions,
      List<String> responses,
      String comment,
      LocalDateTime createdAt
  ) {
    this.name = name;
    this.email = email;
    this.mockExam = null;
    this.totalQuestions = totalQuestions;
    this.responses = responses;
    this.missedMainQuestionNumbers = new ArrayList<>();
    this.diagnosisPdfFile = null;
    this.comment = comment;
    this.createdAt = createdAt;

    this.ipmScore = 0.0;
    this.icpPrevious = 0.0;
    this.punishmentScore = 0.0;
  }

  public static List<MockExamResponse> parseResponse(List<List<String>> studentsResponse) {
    return studentsResponse.stream()
        .map(studentResponse -> {
          DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yy H:mm");

          String name = studentResponse.get(3);
          String email = studentResponse.get(1);
          String createdAt = studentResponse.get(0);
          String comment = studentResponse.get(49);
          List<String> studentAnswers = studentResponse.subList(4, 49);

          List<String> responses = studentAnswers.stream()
              .map(String::toUpperCase)
              .collect(Collectors.toList());

          return new MockExamResponse(
              name,
              email,
              studentAnswers.size(),
              responses,
              comment,
              LocalDateTime.parse(createdAt, formatter)
          );
        })
        .collect(Collectors.toList());
  }
}
