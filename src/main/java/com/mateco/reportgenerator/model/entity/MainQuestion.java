package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.MainQuestionInputDto;
import com.mateco.reportgenerator.controller.dto.QuestionInputDto;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
      orphanRemoval = true
  )
  private List<Alternative> alternatives;

  @OneToOne(cascade = CascadeType.ALL, mappedBy = "mainQuestionAnswer")
  private Alternative answer;

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

  public void setSubjects(Subject subject) {
    this.subjects.add(subject);
  }

  public MainQuestion(
      String title,
      List<Subject> subjects,
      String level,
      String image,
      List<Alternative> alternatives,
      Alternative answer,
      List<AdaptedQuestion> adaptedQuestions,
      List<MockExam> mockExams,
      List<Handout> handout
  ) {
    super(title, level, image);
    this.subjects = subjects;
    this.alternatives = alternatives;
    this.answer = answer;
    this.adaptedQuestions = adaptedQuestions;
    this.mockExams = mockExams;
    this.handout = handout;
  }

  public MainQuestion(
      String title,
      String level,
      String image,
      List<Alternative> alternatives,
      Alternative answer
  ) {
    super(title, level, image);
    this.alternatives = alternatives;
    this.answer = answer;
  }

  public static MainQuestion parseMainQuestion(QuestionInputDto mainQuestionInputDto) {
    return new MainQuestion(
        mainQuestionInputDto.title(),
        mainQuestionInputDto.level(),
        mainQuestionInputDto.image(),
        Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
        Alternative.parseAlternative(mainQuestionInputDto.answer())
    );
  }

  public static MainQuestion parseMainQuestion(MainQuestionInputDto mainQuestionInputDto) {
    return new MainQuestion(
        mainQuestionInputDto.title(),
        Subject.parseSubject(mainQuestionInputDto.subjects()),
        mainQuestionInputDto.level(),
        mainQuestionInputDto.image(),
        Alternative.parseAlternative(mainQuestionInputDto.alternatives()),
        Alternative.parseAlternative(mainQuestionInputDto.answer()),
        mainQuestionInputDto.adaptedQuestions(),
        mainQuestionInputDto.mockExams(),
        mainQuestionInputDto.handout()
    );
  }
}
