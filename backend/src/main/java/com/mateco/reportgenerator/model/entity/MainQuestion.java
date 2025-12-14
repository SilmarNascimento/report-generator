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
import java.util.stream.Stream;
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

  protected List<String> images;

  private int lerickucas;

  @Enumerated(EnumType.STRING)
  private Pattern pattern;

  private int weight;

  @ManyToMany
  @JoinTable(
      name = "questions_content",
      joinColumns = @JoinColumn(name = "main_question_id"),
      inverseJoinColumns = @JoinColumn(name = "subject_id")
  )
  private List<Subject> subjects;

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
          List<Subject> subjects,
          String level,
          List<String> images,
          List<Alternative> alternatives,
          String videoResolutionUrl,
          List<AdaptedQuestion> adaptedQuestions,
          FileEntity adaptedQuestionsPdfFile,
          List<MockExam> mockExams,
          List<Handout> handout
  ) throws IOException {

    super(title, level);

    this.images = images;
    this.subjects = subjects;
    this.alternatives = alternatives;
    this.videoResolutionUrl = videoResolutionUrl;
    this.adaptedQuestions = adaptedQuestions;
    this.adaptedQuestionsPdfFile = adaptedQuestionsPdfFile;
    this.mockExams = mockExams;
    this.handout = handout;

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
        "image: " + this.images +
        "subjects: " + this.subjects +
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
              new ArrayList<>(),
              mainQuestionInputDto.level(),
              new ArrayList<>(),
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
              new ArrayList<>(),
              mainQuestionInputDto.level(),
              new ArrayList<>(),
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
              Subject.parseSubject(mainQuestionInputDto.subjects()),
              mainQuestionInputDto.level(),
              mainQuestionInputDto.images(),
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
              Subject.parseSubject(mainQuestionInputDto.subjects()),
              mainQuestionInputDto.level(),
              mainQuestionInputDto.images(),
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

  public void updateMainQuestionImages(List<String> questionImages) {
    int alternativeQuantity = this.getAlternatives().size();
    int imagesPerAlternative = questionImages.size() / alternativeQuantity;
    int alternativeImageOffset =
        questionImages.size() - (imagesPerAlternative * alternativeQuantity);
    final int[] alternativeIndex = {alternativeImageOffset};

    this.setImages(questionImages.subList(0, alternativeImageOffset));
    this.getAlternatives().forEach((Alternative alternative) -> {
      alternative.setMainQuestion(this);
      alternative.setImages(questionImages.subList(
          alternativeIndex[0],
          alternativeIndex[0] + imagesPerAlternative
      ));
      alternativeIndex[0] += imagesPerAlternative;
    });
  }

  public List<String> getAllStringImages() {
    List<String> allMainQuestionImages = Stream.concat(
            this.getImages().stream(),
            this.getAlternatives().stream()
                .flatMap(alternative -> alternative.getImages().stream())
        )
        .collect(Collectors.toList());

    List<AdaptedQuestion> allAdaptedQuestions = this.getAdaptedQuestions();
    if (!allAdaptedQuestions.isEmpty()) {
      List<String> allAdaptedQuestionStringImages = allAdaptedQuestions.stream()
          .flatMap(adaptedQuestion -> adaptedQuestion.getAllStringImages().stream())
          .collect(Collectors.toList());
      allMainQuestionImages.addAll(allAdaptedQuestionStringImages);
    }

    return allMainQuestionImages;
  }

}
