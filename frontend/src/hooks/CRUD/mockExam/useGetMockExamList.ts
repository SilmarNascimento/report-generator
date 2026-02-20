import { useQuery } from "@tanstack/react-query";
import { PageResponse, MockExam } from "@/interfaces";
import apiService from "@/service/ApiService";

interface Params {
  query: string;
  page: number;
  pageSize: number;
}

export function useGetMockExamList({ query, page, pageSize }: Params) {
  return useQuery({
    queryKey: ["mock-exams", query, page, pageSize],

    queryFn: () =>
      apiService.get<PageResponse<MockExam>>(
        `/mock-exam?pageNumber=${page - 1}&pageSize=${pageSize}&query=${query}`,
      ),
  });
}
