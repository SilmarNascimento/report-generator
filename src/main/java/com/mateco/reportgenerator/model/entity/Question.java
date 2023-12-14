package com.mateco.reportgenerator.model.entity;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class Question {
  private String title;

  private String level;

  private String image;

  private List<Alternative> alternatives;

  private Alternative answer;

  public Question(String title, String level, String image) {
    this.title = title;
    this.level = level;
    this.image = image;
  }
}
