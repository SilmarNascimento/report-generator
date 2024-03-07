package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.questionDto.MainQuestionInputDto;
import com.mateco.reportgenerator.controller.dto.questionDto.QuestionInputDto;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "main_questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MainQuestion extends Question {

  protected List<String> images;

  @ManyToMany
  @JoinTable(
      name = "questions_content",
      joinColumns = @JoinColumn(name = "subject_id"),
      inverseJoinColumns = @JoinColumn(name = "main_question_id")
  )
  private List<Subject> subjects;

  @OneToMany(
      mappedBy = "mainQuestion",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.EAGER
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

  @ManyToMany(mappedBy = "mockExamQuestions")
  @JsonIgnore
  private List<MockExam> mockExams;

  @ManyToMany(mappedBy = "handoutQuestions")
  @JsonIgnore
  private List<Handout> handout;

  public MainQuestion(
      String title,
      List<Subject> subjects,
      String level,
      List<String> images,
      List<Alternative> alternatives,
      List<AdaptedQuestion> adaptedQuestions,
      List<MockExam> mockExams,
      List<Handout> handout
  ) {
    super(title, level);
    this.images = images;
    this.subjects = subjects;
    this.alternatives = alternatives;
    this.adaptedQuestions = adaptedQuestions;
    this.mockExams = mockExams;
    this.handout = handout;
  }

  @Override
  public String toString() {
    return "Subject {" +
        "id: " + this.getId() +
        "title: " + this.title +
        "level: " + this.level +
        "image: " + this.images +
        "subjects: " + this.subjects +
        "alternatives: " + this.alternatives +
        '}';
  }

  public static MainQuestion parseMainQuestion(
      QuestionInputDto mainQuestionInputDto
  ) throws IOException {
    return new MainQuestion(
        mainQuestionInputDto.title(),
        new ArrayList<>(),
        mainQuestionInputDto.level(),
        new ArrayList<>(),
        Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
  }

  public static MainQuestion parseMainQuestion(
      MainQuestionInputDto mainQuestionInputDto
  ) throws IOException {
    return new MainQuestion(
        mainQuestionInputDto.title(),
        Subject.parseSubject(mainQuestionInputDto.subjects()),
        mainQuestionInputDto.level(),
        mainQuestionInputDto.images(),
        Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
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
