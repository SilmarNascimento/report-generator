import { MockExam } from "@/interfaces";
import apiService from "@/service/ApiService";
import { useQuery } from "@tanstack/react-query";

export function useGetMockExamMainQuestionManager(
  mockExamId: string | undefined,
  mockExamRef: React.MutableRefObject<MockExam | undefined>,
  idListRef: React.MutableRefObject<string[] | undefined>,
) {
  return useQuery({
    queryKey: ["get-mock-exam", mockExamId],
    queryFn: async () => {
      const data = await apiService.get<MockExam>(`/mock-exam/${mockExamId}`);

      mockExamRef.current = data;
      idListRef.current = Object.values(data.mockExamQuestions).map(
        (q) => q.id,
      );

      return data;
    },
    enabled: !!mockExamId,
  });
}
