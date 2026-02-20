package com.mateco.reportgenerator.model.entity;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamInputDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;
import java.util.stream.Collectors;

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

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "cover_file_id")
    private FileEntity coverPdfFile;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "matrix_file_id")
    private FileEntity matrixPdfFile;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "answers_file_id")
    private FileEntity answersPdfFile;

    @ManyToMany
    @JoinTable(
            name = "mock_exams_questions",
            joinColumns = @JoinColumn(name = "main_question_id"),
            inverseJoinColumns = @JoinColumn(name = "mock_exam_id")
    )
    private Map<Integer, MainQuestion> mockExamQuestions;

    //TODO revisar relacionamento e keys entre MainQuestion e MockExam
//    @ManyToMany(fetch = FetchType.EAGER)
//    @JoinTable(
//            name = "mock_exams_questions",
//            joinColumns = @JoinColumn(name = "mock_exam_id"),
//            inverseJoinColumns = @JoinColumn(name = "main_question_id")
//    )
//    @MapKeyColumn(name = "mock_exam_questions_key")
//    private Map<Integer, MainQuestion> mockExamQuestions;

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
        this.mockExamQuestions = new HashMap<>();
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

    @Override
    public String toString() {
        return "{" +
                "id: " + this.getId() +
                "name: " + this.name +
                "className: " + this.className +
                "subjects: " + this.subjects +
                "releasedYear: " + this.releasedYear +
                "number: " + this.number +
                "mockExamQuestions: " + this.mockExamQuestions +
                '}';
    }

    public String generateCode() {
        return this.releasedYear + ":S" + this.number + "-" + this.className.get(0);
    }

    public List<Integer> findAllAvailableSlots() {
        return this.getMockExamQuestions().entrySet().stream()
                .filter(entry -> entry.getValue() == null)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

}
