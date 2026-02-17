import { PageResponse, Subject } from "@/interfaces";
import apiService from "@/service/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useFilteredSubjectsForMainQuestion(
  page: number,
  pageSize: number,
  query: string,
  subjectIdListRef: React.MutableRefObject<string[] | undefined>,
) {
  return useQuery({
    queryKey: ["get-subjects-filter", query, page, pageSize],
    queryFn: () =>
      apiService.post<PageResponse<Subject>>(`/subject/filter`, {
        subjectsId: subjectIdListRef.current,
      }),
    enabled: !!subjectIdListRef.current,
  });
}
