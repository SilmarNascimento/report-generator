package com.mateco.reportgenerator.controller.dto.FileEntityDto;

public record FileDownloadDto(
        String fileName,
        String contentType,
        byte[] content
) {
}