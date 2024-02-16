package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "adapted_question_wrapper")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdaptedQuestionWrapper {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  private UUID mainQuestionId;

  @OneToMany(cascade = CascadeType.ALL)
  @JoinColumn(name = "adapted_question_list_id")
  private List<AdaptedQuestion> adaptedQuestionList;

  public AdaptedQuestionWrapper(
      UUID mainQuestionId,
      List<AdaptedQuestion> adaptedQuestionList
  ) {
    this.mainQuestionId = mainQuestionId;
    this.adaptedQuestionList = adaptedQuestionList;
  }
}
