package com.mateco.reportgenerator.controller.dto.student;


import com.mateco.reportgenerator.enums.ClassGroup;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

import java.time.OffsetDateTime;

public record StudentRequestDto(
        @NotBlank(message = "O nome é obrigatório")
        String name,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        String password,

        @NotBlank(message = "O CPF é obrigatório")
        @CPF(message = "CPF inválido")
        String cpf,

        @NotNull(message = "O ano de matrícula é obrigatório")
        Integer enrollmentYear,

        @NotNull(message = "A turma é obrigatória")
        ClassGroup classGroup,

        @NotNull(message = "A data de ativação é obrigatória")
        OffsetDateTime activationDate,

        String photoUrl,

        @Valid
        AddressDto address
) {
}