import { useQuery } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { MainQuestion, PageResponse } from "@/interfaces";

export function useGetMainQuestions(
  page: number,
  pageSize: number,
  filter: string,
  excludedIds: string[],
) {
  return useQuery<PageResponse<MainQuestion>>({
    queryKey: ["get-main-questions", filter, page, pageSize],
    queryFn: async () => {
      return await apiService.post<PageResponse<MainQuestion>>(
        `/main-question/filter?pageNumber=${page - 1}&pageSize=${pageSize}&query=${filter}`,
        { mainQuestionsId: excludedIds },
      );
    },
  });
}
