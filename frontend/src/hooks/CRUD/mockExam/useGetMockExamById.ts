import { useQuery } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { MockExamReceived } from "@/interfaces/MockExam";

export function useGetMockExamById(mockExamId: string) {
  return useQuery<MockExamReceived>({
    queryKey: ["get-mock-exam", mockExamId],
    queryFn: async () => {
      const data = await apiService.get<MockExamReceived>(
        `/mock-exam/${mockExamId}`,
      );
      return data;
    },
    enabled: !!mockExamId,
  });
}
