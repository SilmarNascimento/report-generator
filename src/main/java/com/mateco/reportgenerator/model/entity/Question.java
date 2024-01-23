package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public abstract class Question {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  protected String title;

  protected String level;

  public Question(String title, String level) {
    this.title = title;
    this.level = level;
  }
}
