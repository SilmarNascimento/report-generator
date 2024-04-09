package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.alternativeDto.AlternativeInputDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
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

  @Column(columnDefinition = "TEXT")
  private String description;

  private List<String> images;

  @ManyToOne
  @JoinColumn(name = "main_question_id")
  @JsonIgnore
  private MainQuestion mainQuestion;

  @ManyToOne
  @JoinColumn(name = "adapted_question_id")
  @JsonIgnore
  private AdaptedQuestion adaptedQuestion;

  private boolean questionAnswer;

  public Alternative(String description, List<String> images, boolean questionAnswer) {
    this.description = description;
    this.images = images;
    this.questionAnswer = questionAnswer;
  }

  @Override
  public String toString() {
    return "Alternative{" +
        "id: " + this.getId() +
        "description: " + this.description +
        "image: " + this.images +
        '}';
  }

  public static Alternative parseAlternative(AlternativeInputDto alternativeInputDto) {
    return new Alternative(
        alternativeInputDto.description(),
        new ArrayList<>(),
        alternativeInputDto.questionAnswer()
    );
  }

  public static List<Alternative> parseAlternative(List<AlternativeInputDto> alternativesInputDto) {
    return alternativesInputDto.stream()
        .map((AlternativeInputDto alternativeInputDto) -> new Alternative(
            alternativeInputDto.description(),
            new ArrayList<>(),
            alternativeInputDto.questionAnswer()
          ))
        .toList();
  }
}
