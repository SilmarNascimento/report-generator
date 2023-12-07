package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "adapted_questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdaptedQuestion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private UUID id;

  private String title;

  private String image;

  private List<Alternative> alternatives;

  private Alternative answer;

  @ManyToOne
  @JoinColumn(name = "main_question_id")
  @JsonIgnore
  private MainQuestion mainQuestion;
}
