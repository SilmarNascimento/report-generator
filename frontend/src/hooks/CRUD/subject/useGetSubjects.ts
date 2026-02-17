import { useQuery } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { Subject } from "@/interfaces";
import { PageResponse } from "@/interfaces/PageResponse";

export function useGetSubjects(page: number, pageSize: number, filter: string) {
  return useQuery<PageResponse<Subject>>({
    queryKey: ["get-subjects", filter, page, pageSize],
    queryFn: async () => {
      const response = await apiService.post<PageResponse<Subject>>(
        `/subject/filter?pageNumber=${page - 1}&pageSize=${pageSize}&query=${filter}`,
        { subjectsId: [] },
      );
      return response;
    },
  });
}
