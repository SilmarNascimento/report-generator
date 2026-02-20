package com.mateco.reportgenerator.controller.dto.user;

public record UserCreateDto(
        String username,
        String name,
        String email,
        String password
) {
}