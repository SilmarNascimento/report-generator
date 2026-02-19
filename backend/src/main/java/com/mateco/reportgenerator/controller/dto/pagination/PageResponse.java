package com.mateco.reportgenerator.controller.dto.pagination;

import org.springframework.data.domain.Page;

import java.util.List;

public record PageResponse<T>(
        List<T> data,
        int currentPage,
        int pageItems,
        long totalItems,
        int pages
) {
    public static <T> PageResponse<T> build(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getNumberOfElements(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}