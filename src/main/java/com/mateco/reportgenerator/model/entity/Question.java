package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.MappedSuperclass;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public abstract class Question {
  protected String title;

  protected String level;

  protected String image;

  protected List<Alternative> alternatives;

  protected Alternative answer;

  public Question(String title, String level, String image) {
    this.title = title;
    this.level = level;
    this.image = image;
  }
}
