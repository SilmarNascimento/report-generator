import { useQuery } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { MainQuestion, PageResponse } from "@/interfaces";

export function useGetMainQuestionList(
  query: string,
  page: number,
  pageSize: number,
) {
  return useQuery<PageResponse<MainQuestion>>({
    queryKey: ["get-main-questions", query, page, pageSize],
    queryFn: () =>
      apiService.get<PageResponse<MainQuestion>>("/main-question", {
        pageNumber: page - 1,
        pageSize,
        query,
      }),
  });
}
