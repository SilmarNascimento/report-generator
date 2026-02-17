import { useQuery } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { MainQuestionReceived } from "@/interfaces/MainQuestion";

export function useGetMainQuestionById(mainQuestionId: string) {
  return useQuery<MainQuestionReceived>({
    queryKey: ["get-main-question", mainQuestionId],
    queryFn: () =>
      apiService.get<MainQuestionReceived>(`/main-question/${mainQuestionId}`),
    enabled: !!mainQuestionId,
  });
}
