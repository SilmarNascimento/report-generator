package com.mateco.reportgenerator.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.io.IOException;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "file_entity")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileEntity {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  @Column(name = "file_name")
  private String fileName;

  @Column(name = "file_type")
  private String fileType;

  @Column(name = "file_size")
  private Long fileSize;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "file_content_id")
  private FileContent fileContent;

  public FileEntity(MultipartFile file) throws IOException {
    this.fileName = file.getOriginalFilename();
    this.fileType = file.getContentType();
    this.fileSize = file.getSize();

    this.fileContent = new FileContent(file.getBytes());
  }
}
