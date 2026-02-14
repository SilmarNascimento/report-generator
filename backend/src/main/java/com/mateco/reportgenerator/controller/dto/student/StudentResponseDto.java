package com.mateco.reportgenerator.controller.dto.student;

import com.mateco.reportgenerator.enums.ClassGroup;

import java.time.OffsetDateTime;

public record StudentResponseDto(
        Long id,
        String name,
        String email,
        String cpf,
        ClassGroup classGroup,
        Integer enrollmentYear,
        OffsetDateTime activationDate,
        AddressDto address
) {
}