package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
  private List<Subject> contents;

  private String image;

  private List<Alternative> alternatives;

  private Alternative answer;

  @Column(name = "adapted_question")
  @OneToMany(mappedBy = "mainQuestion")
  private List<AdaptedQuestion> adaptedQuestions;

  private List<MockExam> mockExams;

  private List<Handout> handout;
}
