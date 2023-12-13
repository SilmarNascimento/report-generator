package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.MainQuestionInputDto;
import com.mateco.reportgenerator.controller.dto.QuestionInputDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "main_questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MainQuestion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private UUID id;

  private String title;

  @ManyToMany
  @JoinTable(
      name = "questions_content",
      joinColumns = @JoinColumn(name = "subject_id"),
      inverseJoinColumns = @JoinColumn(name = "main_question_id")
  )
  private List<Subject> subjects;

  private String level;

  private String image;

  private List<Alternative> alternatives;

  private Alternative answer;

  @Column(name = "adapted_questions")
  @OneToMany(mappedBy = "mainQuestion")
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

  public MainQuestion(String title, List<Subject> subjects, String level, String image,
      List<Alternative> alternatives, Alternative answer, List<AdaptedQuestion> adaptedQuestions,
      List<MockExam> mockExams, List<Handout> handout) {
    this.title = title;
    this.subjects = subjects;
    this.level = level;
    this.image = image;
    this.alternatives = alternatives;
    this.answer = answer;
    this.adaptedQuestions = adaptedQuestions;
    this.mockExams = mockExams;
    this.handout = handout;
  }

  public MainQuestion(String title, String level, String image, List<Alternative> alternatives,
      Alternative answer) {
    this.title = title;
    this.level = level;
    this.image = image;
    this.alternatives = alternatives;
    this.answer = answer;
  }

  public static MainQuestion parseMainQuestion(QuestionInputDto mainQuestionInputDto) {
    return new MainQuestion(
        mainQuestionInputDto.title(),
        mainQuestionInputDto.level(),
        mainQuestionInputDto.image(),
        mainQuestionInputDto.alternatives(),
        mainQuestionInputDto.answer()
    );
  }

  public static MainQuestion parseMainQuestion(MainQuestionInputDto mainQuestionInputDto) {
    return new MainQuestion(
        mainQuestionInputDto.title(),
        mainQuestionInputDto.subjects(),
        mainQuestionInputDto.level(),
        mainQuestionInputDto.image(),
        mainQuestionInputDto.alternatives(),
        mainQuestionInputDto.answer(),
        mainQuestionInputDto.adaptedQuestions(),
        mainQuestionInputDto.mockExams(),
        mainQuestionInputDto.handout()
    );
  }
}
