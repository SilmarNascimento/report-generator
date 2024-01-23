package com.mateco.reportgenerator.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "apendice")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attachment {
  @Id
  @GeneratedValue(generator = "UUID")
  private UUID id;

  private String title;

  private String type;

  private int order;

  private long size;

  @Lob
  private byte[] content;

  @ManyToOne
  @JoinColumn(name = "main_question_id")
  @JsonIgnore
  private MainQuestion mainQuestion;

  @ManyToOne
  @JoinColumn(name = "adapted_question_id")
  @JsonIgnore
  private AdaptedQuestion adaptedQuestion;

  @ManyToOne
  @JoinColumn(name = "alternative_id")
  @JsonIgnore
  private Alternative alternative;

  public Attachment(
      String title,
      String type,
      long size,
      byte[] content
  ) {
    this.title = title;
    this.type = type;
    this.size = size;
    this.content = content;
  }

  public static List<Attachment> parseAttachment(List<MultipartFile> inputImages) throws IOException {
    return inputImages.stream()
        .map((MultipartFile inputImage) -> {
          try {
            return new Attachment(
                inputImage.getName(),
                inputImage.getContentType(),
                inputImage.getSize(),
                inputImage.getBytes()
            );
          } catch (IOException exception) {
            throw new RuntimeException(exception);
          }
        })
        .toList();
  }
}
