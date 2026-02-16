package com.mateco.reportgenerator.controller.dto.pagination;

import org.springframework.data.domain.Page;

import java.util.List;

public record PageResponse<T>(
        List<T> conteudo,
        int paginaAtual,
        int itensPorPagina,
        long totalItens,
        int totalPaginas
) {
    public static <T> PageResponse<T> build(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}