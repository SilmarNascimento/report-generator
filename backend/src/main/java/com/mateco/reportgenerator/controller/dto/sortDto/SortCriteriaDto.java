package com.mateco.reportgenerator.controller.dto.sortDto;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Sort;

public record SortCriteriaDto(
    String property,
    Sort.Direction direction
) {
  public static List<SortCriteriaDto> parseSortCriteria(List<String> sort) {
    List<SortCriteriaDto> sortCriteria = new ArrayList<>();
    if (sort != null && !sort.isEmpty()) {
      if (!sort.get(0).contains(",")) {
        String newSort = String.join(",", sort);
        sort = new ArrayList<>();
        sort.add(newSort);
      }

      for (String sortParam : sort) {
        String[] parts = sortParam.split(",");
        if (parts.length == 2) {
          String property = parts[0];
          Sort.Direction direction = Sort.Direction.fromString(parts[1]);
          sortCriteria.add(new SortCriteriaDto(property, direction));
        }
      }
    }
    return sortCriteria;
  }
}
