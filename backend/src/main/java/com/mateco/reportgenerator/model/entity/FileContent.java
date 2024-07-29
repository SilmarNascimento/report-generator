package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "file_content")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileContent {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  @Column(columnDefinition = "BYTEA")
  private byte[] content;

  @OneToOne(mappedBy = "fileContent")
  private FileEntity fileEntity;

  public FileContent(byte[] content) {
    this.content = content;
  }
}
