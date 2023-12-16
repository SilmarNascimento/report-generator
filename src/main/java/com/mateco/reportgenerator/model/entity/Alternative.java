package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.AlternativeInputDto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "alternatives")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Alternative {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  private String description;

  private String image;

  @ManyToOne
  @JoinColumn(name = "main_question_id")
  @JsonIgnore
  private MainQuestion mainQuestion;

  @OneToOne()
  @JoinColumn(name = "main_question_answer_id")
  @JsonIgnore
  private MainQuestion mainQuestionAnswer;

  @ManyToOne
  @JoinColumn(name = "adapted_question_id")
  @JsonIgnore
  private AdaptedQuestion adaptedQuestion;

  @OneToOne()
  @JoinColumn(name = "adapted_question_answer_id")
  @JsonIgnore
  private AdaptedQuestion adaptedQuestionAnswer;

  public Alternative(String description, String image) {
    this.description = description;
    this.image = image;
  }

  public static Alternative parseAlternative(AlternativeInputDto alternativeInputDto) {
    return new Alternative(
        alternativeInputDto.description(),
        alternativeInputDto.image()
    );
  }

  public static List<Alternative> parseAlternative(List<AlternativeInputDto> alternativesInputDto) {
    return alternativesInputDto.stream()
        .map((AlternativeInputDto alternativeInputDto) -> new Alternative(
          alternativeInputDto.description(),
          alternativeInputDto.image()
        ))
        .toList();
  }
}
