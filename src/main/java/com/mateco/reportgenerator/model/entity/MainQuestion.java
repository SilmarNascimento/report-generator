package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.MainQuestionInputDto;
import com.mateco.reportgenerator.controller.dto.QuestionInputDto;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
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
      String image,
      List<Alternative> alternatives,
      List<AdaptedQuestion> adaptedQuestions,
      List<MockExam> mockExams,
      List<Handout> handout
  ) {
    super(title, level, image);
    this.subjects = subjects;
    this.alternatives = alternatives;
    this.adaptedQuestions = adaptedQuestions;
    this.mockExams = mockExams;
    this.handout = handout;
  }

  public static MainQuestion parseMainQuestion(QuestionInputDto mainQuestionInputDto) {
    return new MainQuestion(
        mainQuestionInputDto.title(),
        new ArrayList<>(),
        mainQuestionInputDto.level(),
        mainQuestionInputDto.image(),
        Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
  }

  public static MainQuestion parseMainQuestion(MainQuestionInputDto mainQuestionInputDto) {
    return new MainQuestion(
        mainQuestionInputDto.title(),
        Subject.parseSubject(mainQuestionInputDto.subjects()),
        mainQuestionInputDto.level(),
        mainQuestionInputDto.image(),
        Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
        new ArrayList<>(),
        new ArrayList<>(),
        new ArrayList<>()
    );
  }
}
