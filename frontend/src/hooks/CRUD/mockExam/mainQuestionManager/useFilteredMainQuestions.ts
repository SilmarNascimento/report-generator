import { MainQuestion, PageResponse } from "@/interfaces";
import apiService from "@/service/ApiService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useFilteredMainQuestions(
  pageNumber: number,
  pageSize: number,
  query: string,
  excludedIds: string[],
  enabled = true,
) {
  return useQuery({
    queryKey: ["get-main-questions-filtered", query, pageNumber, pageSize, excludedIds],
    queryFn: () =>
      apiService.post<PageResponse<MainQuestion>>(
        `/main-question/filter?pageNumber=${pageNumber - 1}&pageSize=${pageSize}&query=${query}`,
        { excludedIds },
      ),
    enabled,
    placeholderData: keepPreviousData,
  });
}
