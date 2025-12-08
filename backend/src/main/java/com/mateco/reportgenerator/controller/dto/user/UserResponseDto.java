package com.mateco.reportgenerator.controller.dto.user;

import lombok.Builder;

@Builder
public record UserResponseDto(
        Long id,
        String username,
        String name,
        String email,
        String image
) {
}
