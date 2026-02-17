import { MainQuestion, PageResponse } from "@/interfaces";
import apiService from "@/service/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useFilteredMainQuestions(
  page: number,
  pageSize: number,
  query: string,
  idListRef: React.MutableRefObject<string[] | undefined>,
) {
  return useQuery({
    queryKey: ["get-main-questions", query, page, pageSize],
    queryFn: () =>
      apiService.post<PageResponse<MainQuestion>>(`/main-question/filter`, {
        mainQuestionsId: idListRef.current,
      }),
    enabled: !!idListRef.current,
  });
}
