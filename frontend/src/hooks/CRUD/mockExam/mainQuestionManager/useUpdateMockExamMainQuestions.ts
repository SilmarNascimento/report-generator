import { MockExam } from "@/interfaces";
import apiService from "@/service/ApiService";
import { successAlert } from "@/utils/toastAlerts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateMockExamMainQuestions(mockExamId: string | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (questionIds: string[]) =>
      apiService.put<MockExam>(`/mock-exam/${mockExamId}/main-question`, {
        mainQuestionsId: questionIds,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["get-mock-exam"] });
      qc.invalidateQueries({ queryKey: ["get-main-questions-filtered"] });
      successAlert("Questões do simulado atualizadas com sucesso");
    },
  });
}
