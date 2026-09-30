package com.mateco.reportgenerator.controller.dto.student;

import java.util.List;

public record StudentImportResultDto(
        int totalRows,
        int importedCount,
        List<StudentImportErrorDto> errors
) {
    public boolean hasErrors() {
        return errors != null && !errors.isEmpty();
    }
}
