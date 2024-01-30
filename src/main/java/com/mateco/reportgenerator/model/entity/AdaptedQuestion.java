package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.QuestionInputDto;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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
  @ManyToOne
  @JoinColumn(name = "main_question_id")
  @JsonIgnore
  private MainQuestion mainQuestion;

  protected List<String> images;

  @OneToMany(
      mappedBy = "adaptedQuestion",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  @ElementCollection
  @OrderColumn
  private List<Alternative> alternatives;

  public AdaptedQuestion(
      String title,
      String level,
      List<String> images,
      List<Alternative> alternatives
  ) {
    super(title, level);
    this.images = images;
    this.alternatives = alternatives;
  }

  @Override
  public String toString() {
    return "AdaptedQuestion{" +
        "id: " + this.getId() +
        "title: " + this.getTitle() +
        "level: " + this.getLevel() +
        "image: " + this.images +
        "alternatives: " + this.alternatives +
        '}';
  }

  public static AdaptedQuestion parseAdaptedQuestion(
      QuestionInputDto questionInputDto
  ) {
    if (questionInputDto.alternatives() == null || questionInputDto.alternatives().isEmpty()) {
      return new AdaptedQuestion(
          questionInputDto.title(),
          questionInputDto.level(),
          new ArrayList<>(),
          null
      );
    }
    return new AdaptedQuestion(
        questionInputDto.title(),
        questionInputDto.level(),
        new ArrayList<>(),
        Alternative.parseAlternative(questionInputDto.alternatives())
    );
  }
}
