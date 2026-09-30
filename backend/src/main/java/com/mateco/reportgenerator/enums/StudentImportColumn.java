package com.mateco.reportgenerator.enums;

import com.mateco.reportgenerator.utils.TextUtils;

import java.util.Arrays;
import java.util.Optional;

public enum StudentImportColumn {
    NAME("Nome", true),
    EMAIL("Email", true),
    CPF("CPF", true),
    ENROLLMENT_YEAR("Ano de Matrícula", true),
    CLASS_GROUPS("Turmas", true),
    PHONE("Telefone", false),
    STREET("Rua", false),
    NUMBER("Número", false),
    COMPLEMENT("Complemento", false),
    NEIGHBORHOOD("Bairro", false),
    CITY("Cidade", false),
    STATE("Estado", false),
    ZIP_CODE("CEP", false),
    PHOTO("Foto", false);

    private final String header;
    private final boolean requiredHeader;

    StudentImportColumn(String header, boolean requiredHeader) {
        this.header = header;
        this.requiredHeader = requiredHeader;
    }

    public String getHeader() {
        return header;
    }

    public boolean isRequiredHeader() {
        return requiredHeader;
    }

    public static Optional<StudentImportColumn> fromHeader(String header) {
        String normalizedHeader = normalizeHeader(header);

        return Arrays.stream(values())
                .filter(column -> normalizeHeader(column.header).equals(normalizedHeader))
                .findFirst();
    }

    private static String normalizeHeader(String header) {
        return TextUtils.normalize(header).replaceAll("[^a-z0-9]", "");
    }
}
