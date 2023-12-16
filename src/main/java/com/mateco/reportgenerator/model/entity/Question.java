package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
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

  protected String image;

  public Question(String title, String level, String image) {
    this.title = title;
    this.level = level;
    this.image = image;
  }
}
