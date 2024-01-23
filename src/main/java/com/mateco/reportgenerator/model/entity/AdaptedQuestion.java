package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.QuestionInputDto;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.io.IOException;
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
  @ManyToOne
  @JoinColumn(name = "main_question_id")
  @JsonIgnore
  private MainQuestion mainQuestion;

  @OneToMany(
      mappedBy = "adaptedQuestion",
      cascade = CascadeType.ALL,
      orphanRemoval = true
  )
  private List<Alternative> alternatives;

  public AdaptedQuestion(
      String title,
      String level,
      List<Attachment> images,
      List<Alternative> alternatives
  ) {
    super(title, level, images);
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
  ) throws IOException {
    if (questionInputDto.alternatives() == null || questionInputDto.alternatives().isEmpty()) {
      return new AdaptedQuestion(
          questionInputDto.title(),
          questionInputDto.level(),
          Attachment.parseAttachment(questionInputDto.image()),
          null
      );
    }
    return new AdaptedQuestion(
        questionInputDto.title(),
        questionInputDto.level(),
        Attachment.parseAttachment(questionInputDto.image()),
        Alternative.parseAlternative(questionInputDto.alternatives())
    );
  }
}
