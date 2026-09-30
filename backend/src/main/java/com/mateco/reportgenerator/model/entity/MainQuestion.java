package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionInputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.QuestionInputDto;
import com.mateco.reportgenerator.enums.Pattern;
import jakarta.persistence.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "main_questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MainQuestion extends Question {

  private int lerickucas;

  @Enumerated(EnumType.STRING)
  private Pattern pattern;

  private int weight;

  @ManyToOne
  @JoinColumn(name = "main_subject_id")
  private Subject mainSubject;

  @ManyToMany
  @JoinTable(
      name = "questions_content",
      joinColumns = @JoinColumn(name = "main_question_id"),
      inverseJoinColumns = @JoinColumn(name = "subject_id")
  )
  private List<Subject> secondarySubjects;

  private String videoResolutionUrl;

  @OneToMany(
      mappedBy = "mainQuestion",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY
  )
  @ElementCollection
  @OrderColumn
  private List<Alternative> alternatives;

  @Column(name = "adapted_questions")
  @OneToMany(
      mappedBy = "mainQuestion",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private List<AdaptedQuestion> adaptedQuestions;

  @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "adapted_questions_file_id")
  private FileEntity adaptedQuestionsPdfFile;

  @ManyToMany(mappedBy = "mockExamQuestions")
  @JsonIgnore
  private List<MockExam> mockExams;

  @ManyToMany(mappedBy = "handoutQuestions")
  @JsonIgnore
  private List<Handout> handout;

  public static final Map<Integer, Integer> WEIGHTS = Map.of(
          1, 10,
          2, 8,
          3, 5,
          4, 3,
          5, 8,
          6, 6,
          7, 3,
          8, 1
  );

  public MainQuestion(
          String title,
          Subject mainSubject,
          List<Subject> secondarySubjects,
          String level,
          List<Alternative> alternatives,
          String videoResolutionUrl,
          List<AdaptedQuestion> adaptedQuestions,
          FileEntity adaptedQuestionsPdfFile,
          List<MockExam> mockExams,
          List<Handout> handouts
  ) throws IOException {

    super(title, level);

    this.mainSubject = mainSubject;
    this.secondarySubjects = secondarySubjects;
    this.alternatives = alternatives;
    this.videoResolutionUrl = videoResolutionUrl;
    this.adaptedQuestions = adaptedQuestions;
    this.adaptedQuestionsPdfFile = adaptedQuestionsPdfFile;
    this.mockExams = mockExams;
    this.handout = handouts;

    if (this.lerickucas != 0) {
      this.weight = WEIGHTS.getOrDefault(this.lerickucas, 0);
    }
  }

  public void setLerickucas(int lerickucas) {
    this.lerickucas = lerickucas;
    this.weight = WEIGHTS.getOrDefault(lerickucas, 0);
  }

  @Override
  public String toString() {
    return "{" +
        "id: " + this.getId() +
        "title: " + this.title +
        "level: " + this.level +
        "mainSubject: " + this.mainSubject +
        "secondarySubjects: " + this.secondarySubjects +
        "alternatives: " + this.alternatives +
        "video resolution: " + this.videoResolutionUrl +
        '}';
  }

  public static MainQuestion parseMainQuestion(
          QuestionInputDto mainQuestionInputDto,
          MultipartFile adaptedQuestionPdfFile
  ) throws IOException {

    MainQuestion question;

    if (adaptedQuestionPdfFile.isEmpty()) {
      question = new MainQuestion(
              mainQuestionInputDto.title(),
              null,
              new ArrayList<>(),
              mainQuestionInputDto.level(),
              Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
              mainQuestionInputDto.videoResolutionUrl(),
              new ArrayList<>(),
              null,
              new ArrayList<>(),
              new ArrayList<>()
      );
    } else {
      FileEntity pdfEntity = new FileEntity(adaptedQuestionPdfFile);
      question = new MainQuestion(
              mainQuestionInputDto.title(),
              null,
              new ArrayList<>(),
              mainQuestionInputDto.level(),
              Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
              mainQuestionInputDto.videoResolutionUrl(),
              new ArrayList<>(),
              pdfEntity,
              new ArrayList<>(),
              new ArrayList<>()
      );
    }

    question.setLerickucas(mainQuestionInputDto.lerickucas());
    question.setPattern(mainQuestionInputDto.pattern());

    return question;
  }

  public static MainQuestion parseMainQuestion(
          MainQuestionInputDto mainQuestionInputDto,
          MultipartFile adaptedQuestionPdfFile
  ) throws IOException {

    MainQuestion question;

    if (adaptedQuestionPdfFile.isEmpty()) {
      question = new MainQuestion(
              mainQuestionInputDto.title(),
              null,
              new ArrayList<>(),
              mainQuestionInputDto.level(),
              Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
              mainQuestionInputDto.videoResolutionUrl(),
              new ArrayList<>(),
              null,
              new ArrayList<>(),
              new ArrayList<>()
      );
    } else {
      FileEntity pdfEntity = new FileEntity(adaptedQuestionPdfFile);
      question = new MainQuestion(
              mainQuestionInputDto.title(),
              null,
              new ArrayList<>(),
              mainQuestionInputDto.level(),
              Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
              mainQuestionInputDto.videoResolutionUrl(),
              new ArrayList<>(),
              pdfEntity,
              new ArrayList<>(),
              new ArrayList<>()
      );
    }

    question.setLerickucas(mainQuestionInputDto.lerickucas());
    question.setPattern(mainQuestionInputDto.pattern());

    return question;
  }

  public void initAlternativeRelationships() {
    this.getAlternatives().forEach(alt -> alt.setMainQuestion(this));
  }

  public List<String> getAllStringImages() {
    return this.getAdaptedQuestions().stream()
        .flatMap(adaptedQuestion -> adaptedQuestion.getAllStringImages().stream())
        .collect(Collectors.toList());
  }

}
