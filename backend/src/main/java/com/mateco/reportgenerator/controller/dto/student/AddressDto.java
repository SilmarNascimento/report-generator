package com.mateco.reportgenerator.controller.dto.student;

import com.mateco.reportgenerator.enums.UF;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddressDto(
        @NotBlank(message = "Rua é obrigatória")
        String street,

        @NotBlank(message = "Número é obrigatório")
        String number,

        String complement,

        @NotBlank(message = "Bairro é obrigatório")
        String neighborhood,

        @NotBlank(message = "Cidade é obrigatória")
        String city,

        @NotNull(message = "Estado (UF) é obrigatório")
        UF state,

        @NotBlank(message = "CEP é obrigatório")
        String zipCode
) {
}