package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "handouts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Handout {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  private String title;

  private String edition;

  private String volume;

  // private List<Subject> subjects;

  @ManyToMany
  @JoinTable(
      name = "handout_questions",
      joinColumns = @JoinColumn(name = "main_question_id"),
      inverseJoinColumns = @JoinColumn(name = "handout_id")
  )
  private List<MainQuestion> handoutQuestions;

  // private List<Alternative> answers;
}
