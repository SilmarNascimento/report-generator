import { MockExam } from "@/interfaces";
import apiService from "@/service/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useGetMockExamMainQuestionManager(
  mockExamId: string | undefined,
) {
  return useQuery({
    queryKey: ["get-mock-exam", mockExamId],
    queryFn: () => apiService.get<MockExam>(`/mock-exam/${mockExamId}`),
    enabled: !!mockExamId,
  });
}
