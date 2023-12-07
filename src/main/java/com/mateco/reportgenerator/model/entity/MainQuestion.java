package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
      name = "question_content",
      joinColumns = @JoinColumn(name = "subject_id"),
      inverseJoinColumns = @JoinColumn(name = "main_question_id")
  )
  private List<Subject> subjects;

  private String image;

  private List<Alternative> alternatives;

  private Alternative answer;

  @Column(name = "adapted_question")
  @OneToMany(mappedBy = "mainQuestion")
  private List<AdaptedQuestion> adaptedQuestions;

  @ManyToMany(mappedBy = "")
  @JsonIgnore
  private List<MockExam> mockExams;

  @ManyToMany(mappedBy = "")
  @JsonIgnore
  private List<Handout> handout;
}
