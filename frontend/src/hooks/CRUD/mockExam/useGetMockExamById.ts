import { useQuery } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { MockExam } from "@/interfaces";

export function useGetMockExamById(mockExamId: string) {
  return useQuery<MockExam>({
    queryKey: ["get-mock-exam", mockExamId],
    queryFn: async () => {
      const data = await apiService.get<MockExam>(`/mock-exam/${mockExamId}`);
      return data;
    },
    enabled: !!mockExamId,
  });
}
