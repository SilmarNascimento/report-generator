package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mateco.reportgenerator.controller.dto.AlternativeInputDto;
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

  @OneToMany(
      mappedBy = "alternative",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.EAGER
  )
  private List<Attachment> images;

  @ManyToOne
  @JoinColumn(name = "main_question_id")
  @JsonIgnore
  private MainQuestion mainQuestion;


  @ManyToOne
  @JoinColumn(name = "adapted_question_id")
  @JsonIgnore
  private AdaptedQuestion adaptedQuestion;

  private boolean questionAnswer;

  public Alternative(String description, List<Attachment> images, boolean questionAnswer) {
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

  public static Alternative parseAlternative(AlternativeInputDto alternativeInputDto)
      throws IOException {
    return new Alternative(
        alternativeInputDto.description(),
        Attachment.parseAttachment(alternativeInputDto.image()),
        alternativeInputDto.questionAnswer()
    );
  }

  public static List<Alternative> parseAlternative(List<AlternativeInputDto> alternativesInputDto) {
    return alternativesInputDto.stream()
        .map((AlternativeInputDto alternativeInputDto) -> {
          try {
            return new Alternative(
              alternativeInputDto.description(),
              Attachment.parseAttachment(alternativeInputDto.image()),
              alternativeInputDto.questionAnswer()
            );
          } catch (IOException exception) {
            throw new RuntimeException(exception);
          }
        })
        .toList();
  }
}
