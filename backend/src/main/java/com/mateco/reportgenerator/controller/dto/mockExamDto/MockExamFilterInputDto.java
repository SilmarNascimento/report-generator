package com.mateco.reportgenerator.controller.dto.mockExamDto;

import java.util.List;
import java.util.UUID;

public record MockExamFilterInputDto(List<UUID> excludedIds) {
}
