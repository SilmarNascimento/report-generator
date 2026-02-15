import { useQuery } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { PageResponse } from "@/interfaces";
import { StudentResponse } from "@/interfaces/Student";

export function useGetStudents(page: number, pageSize: number, query: string) {
  return useQuery<PageResponse<StudentResponse>>({
    queryKey: ["get-students", query, page, pageSize],
    queryFn: async () => {
      const response = await apiService.get<PageResponse<StudentResponse>>(
        `/students`,
        {
          params: {
            pageNumber: page - 1,
            pageSize,
            query,
          },
        },
      );
      return response;
    },
  });
}
