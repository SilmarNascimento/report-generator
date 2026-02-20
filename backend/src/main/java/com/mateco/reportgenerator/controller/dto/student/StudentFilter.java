package com.mateco.reportgenerator.controller.dto.student;

import com.mateco.reportgenerator.enums.ClassGroup;

public record StudentFilter(
        String query,
        String name,
        String email,
        String cpf,
        ClassGroup classGroup
) {
}