import { MainQuestion, PageResponse } from "@/interfaces";
import apiService from "@/service/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useFilteredMainQuestions(
  pageNumber: number,
  pageSize: number,
  query: string,
  mockExamId: string | undefined,
) {
  return useQuery({
    queryKey: ["get-main-questions-filtered", query, pageNumber, pageSize, mockExamId],
    queryFn: () =>
      apiService.post<PageResponse<MainQuestion>>(
        `/main-question/filter?pageNumber=${pageNumber - 1}&pageSize=${pageSize}&query=${query}`,
        { mockExamId },
      ),
    enabled: !!mockExamId,
  });
}
