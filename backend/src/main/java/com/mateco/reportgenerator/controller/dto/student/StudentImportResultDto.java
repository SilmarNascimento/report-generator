package com.mateco.reportgenerator.controller.dto.student;

import java.util.List;

public record StudentImportResultDto(
        int totalRows,
        int importedCount,
        List<StudentImportErrorDto> errors,
        String mensagem
) {
    public StudentImportResultDto(int totalRows, int importedCount, List<StudentImportErrorDto> errors) {
        this(totalRows, importedCount, errors, buildMensagem(errors));
    }

    public boolean hasErrors() {
        return errors != null && !errors.isEmpty();
    }

    private static String buildMensagem(List<StudentImportErrorDto> errors) {
        if (errors == null || errors.isEmpty()) {
            return null;
        }

        String quantidade = errors.size() == 1 ? "1 erro" : errors.size() + " erros";
        return "A planilha possui " + quantidade + ". Nenhum aluno foi cadastrado.";
    }
}
