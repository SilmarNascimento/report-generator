package com.mateco.reportgenerator.controller.dto.student;

/**
 * Erro encontrado em uma célula da planilha de cadastro em massa.
 *
 * @param row     linha da planilha, com a mesma numeração exibida no Excel (cabeçalho = 1)
 * @param column  nome da coluna, como no modelo da planilha
 * @param value   valor lido da célula
 * @param message descrição do problema
 */
public record StudentImportErrorDto(
        int row,
        String column,
        String value,
        String message
) {
}
