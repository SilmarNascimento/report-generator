import { useQuery } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { Subject } from "@/interfaces";
import { PageResponse } from "@/interfaces/PageResponse";

export function useGetSubjects(
  page: number,
  pageSize: number,
  filter: string,
  subjectsId: string[] = [],
  isEnabled: boolean = true,
) {
  return useQuery<PageResponse<Subject>>({
    queryKey: ["get-subjects", filter, page, pageSize, subjectsId],
    queryFn: async () => {
      const response = await apiService.post<PageResponse<Subject>>(
        `/subject/filter?pageNumber=${page - 1}&pageSize=${pageSize}&query=${filter}`,
        { subjectsId: subjectsId ?? [] },
      );
      return response;
    },
    enabled: isEnabled,
  });
}
