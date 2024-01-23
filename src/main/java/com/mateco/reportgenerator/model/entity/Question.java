package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
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

  /**
   * ordem da lista de arquivos apendice das questoes (o que vem do banco de dados)
   * existe a possibildiade de ter a necessidade de baixar algum arquivo referente a questao
   */
  protected Attachment image;

  public Question(String title, String level, Attachment image) {
    this.title = title;
    this.level = level;
    this.image = image;
  }
}
