package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "mock_exam_response")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MockExamResponse {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @ToString.Exclude
    private Student student;

    //TODO remover campos name e email
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

    @ElementCollection
    @OrderColumn(name = "easy_missed_order")
    private List<Integer> easyMissedQuestions;

    @ElementCollection
    @OrderColumn(name = "hard_missed_order")
    private List<Integer> hardMissedQuestions;

    @ElementCollection
    private Map<String, String> top5SubjectsPerformance;

    @ElementCollection
    private Map<String, String> areaPerformance;

    @ElementCollection
    private Map<String, String> difficultyPerformance;

    @ElementCollection
    @OrderColumn(name = "priority_order")
    private List<String> subjectsToReview;

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

        this.easyMissedQuestions = new ArrayList<>();
        this.hardMissedQuestions = new ArrayList<>();
        this.top5SubjectsPerformance = new HashMap<>();
        this.areaPerformance = new HashMap<>();
        this.difficultyPerformance = new HashMap<>();
        this.subjectsToReview = new ArrayList<>();
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
