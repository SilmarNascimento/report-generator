package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
  private List<Subject> contents;
  private String image;
  private List<> alternatives;
  private String answer;
  @Column(name = "adapted_question")
  private List<AdaptedQuestion> adaptedQuestions;
  private List<> mockExams;
  private List<> handout;
}
