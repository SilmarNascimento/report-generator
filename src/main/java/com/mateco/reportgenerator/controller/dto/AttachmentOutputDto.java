package com.mateco.reportgenerator.controller.dto;

import com.mateco.reportgenerator.model.entity.Attachment;
import java.util.List;
import java.util.UUID;

public record AttachmentOutputDto(
    UUID id,
    String title,
    String type,
    long size,
    byte[] content
) {
  public static AttachmentOutputDto parseDto(Attachment attachment) {
    return new AttachmentOutputDto(
      attachment.getId(),
      attachment.getTitle(),
      attachment.getType(),
      attachment.getSize(),
      attachment.getContent()
    );
  }

  public static List<AttachmentOutputDto> parseDto(List<Attachment> attachments) {
    return attachments.stream()
        .map((Attachment attachment) -> new AttachmentOutputDto(
            attachment.getId(),
            attachment.getTitle(),
            attachment.getType(),
            attachment.getSize(),
            attachment.getContent()
        ))
        .toList();
  }
}
