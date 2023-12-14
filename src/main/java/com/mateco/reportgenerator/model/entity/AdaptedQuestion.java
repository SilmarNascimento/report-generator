package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.QuestionInputDto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "adapted_questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AdaptedQuestion extends Question {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private UUID id;

  @OneToMany(
      mappedBy = "adaptedQuestion",
      orphanRemoval = true
  )
  private List<Alternative> alternatives;

  private Alternative answer;

  @ManyToOne
  @JoinColumn(name = "main_question_id")
  @JsonIgnore
  private MainQuestion mainQuestion;

  public AdaptedQuestion(
      String title,
      String level,
      String image,
      List<Alternative> alternatives,
      Alternative answer
  ) {
    super(title, level, image, alternatives, answer);
  }

  public static AdaptedQuestion parseAdaptedQuestion(QuestionInputDto questionInputDto) {
    return new AdaptedQuestion(
        questionInputDto.title(),
        questionInputDto.level(),
        questionInputDto.image(),
        questionInputDto.alternatives(),
        questionInputDto.answer()
    );
  }
}
