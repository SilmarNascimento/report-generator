import { useQuery } from "@tanstack/react-query";
import { PageResponse, MockExam } from "@/interfaces";
import apiService from "@/service/ApiService";

export function useMockExamsByYear(year: string) {
  return useQuery({
    queryKey: ["mock-exams-by-year", year],
    queryFn: async () => {
      const response = await apiService.get<PageResponse<MockExam>>(
        "/mock-exam",
        { pageNumber: 0, pageSize: 200 }
      );
      return response.data.filter((exam) => String(exam.releasedYear) === year);
    },
    enabled: !!year,
  });
}
