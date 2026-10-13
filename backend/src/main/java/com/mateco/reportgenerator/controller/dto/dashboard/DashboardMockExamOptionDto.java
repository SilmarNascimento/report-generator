package com.mateco.reportgenerator.controller.dto.dashboard;

import java.util.UUID;

public record DashboardMockExamOptionDto(
        UUID id,
        String name,
        int number
) {}
