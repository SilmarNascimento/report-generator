package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.QuestionInputDto;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
  @OneToMany(
      mappedBy = "adaptedQuestion",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private List<Alternative> alternatives;

  @ManyToOne
  @JoinColumn(name = "main_question_id")
  @JsonIgnore
  private MainQuestion mainQuestion;

  public AdaptedQuestion(
      String title,
      String level,
      String image,
      List<Alternative> alternatives
  ) {
    super(title, level, image);
    this.alternatives = alternatives;
  }

  @Override
  public String toString() {
    return "AdaptedQuestion{" +
        "id: " + this.getId() +
        "title: " + this.getTitle() +
        "level: " + this.getLevel() +
        "image: " + this.image +
        "alternatives: " + this.alternatives +
        '}';
  }


  public static AdaptedQuestion parseAdaptedQuestion(QuestionInputDto questionInputDto) {
    if (questionInputDto.alternatives() == null || questionInputDto.alternatives().isEmpty()) {
      return new AdaptedQuestion(
          questionInputDto.title(),
          questionInputDto.level(),
          questionInputDto.image(),
          null
      );
    }
    return new AdaptedQuestion(
        questionInputDto.title(),
        questionInputDto.level(),
        questionInputDto.image(),
        Alternative.parseAlternative(questionInputDto.alternatives())
    );
  }
}
