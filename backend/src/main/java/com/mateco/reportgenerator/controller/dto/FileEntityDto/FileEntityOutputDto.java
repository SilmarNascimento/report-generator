package com.mateco.reportgenerator.controller.dto.FileEntityDto;

import com.mateco.reportgenerator.controller.dto.mockExamDto.MockExamOutputDto;
import com.mateco.reportgenerator.model.entity.FileEntity;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record FileEntityOutputDto(
    UUID id,
    String fileName,
    String fileType,
    Long fileSize,
    byte[] fileEntityBytes
) {
  public static FileEntityOutputDto parseDto(FileEntity fileEntity) {
    if (fileEntity == null) {
      return null;
    }
    return new FileEntityOutputDto(
        fileEntity.getId(),
        fileEntity.getFileName(),
        fileEntity.getFileType(),
        fileEntity.getFileSize(),
        fileEntity.getFileContent().getContent()
    );
  }

  public static List<FileEntityOutputDto> parseDto(List<FileEntity> fileEntities) {
    return fileEntities.stream()
        .map(fileEntity -> {
          if (fileEntity == null) {
            return null;
          }
          return new FileEntityOutputDto(
            fileEntity.getId(),
            fileEntity.getFileName(),
            fileEntity.getFileType(),
            fileEntity.getFileSize(),
            fileEntity.getFileContent().getContent()
            );
        }).collect(Collectors.toList());
  }
}
