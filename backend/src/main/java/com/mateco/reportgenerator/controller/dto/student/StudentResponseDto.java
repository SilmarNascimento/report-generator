package com.mateco.reportgenerator.controller.dto.student;

import com.mateco.reportgenerator.enums.ClassGroup;

import java.time.OffsetDateTime;
import java.util.List;

public record StudentResponseDto(
        Long id,
        String name,
        String email,
        String cpf,
        Integer enrollmentYear,
        List<ClassGroup> classGroups,
        OffsetDateTime activationDate,
        String photoUrl,
        AddressDto address,
        List<YearlyPerformanceDto> performanceHistory
) {
}