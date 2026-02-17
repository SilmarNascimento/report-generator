import { MockExam } from "@/interfaces";
import apiService from "@/service/ApiService";
import { successAlert } from "@/utils/toastAlerts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMockExamMainQuestionMutations(
  mockExamId: string | undefined,
  mockExamRef: React.MutableRefObject<MockExam | undefined>,
  idListRef: React.MutableRefObject<string[] | undefined>,
) {
  const qc = useQueryClient();

  const updateRefs = (updated: MockExam) => {
    mockExamRef.current = updated;
    idListRef.current = Object.values(updated.mockExamQuestions).map(
      (q) => q.id,
    );
  };

  const addMainQUestion = useMutation({
    mutationFn: (ids: string[]) =>
      apiService.patch<MockExam>(`/mock-exam/${mockExamId}/main-question`, {
        mainQuestionsId: ids,
      }),
    onSuccess: (updated) => {
      updateRefs(updated);

      qc.invalidateQueries({ queryKey: ["get-main-questions"] });
      qc.invalidateQueries({ queryKey: ["get-mock-exam"] });

      successAlert("Questão principal adicionada com sucesso");
    },
  });

  const removeMainQuestion = useMutation({
    mutationFn: (ids: string[]) =>
      apiService.delete<MockExam>(`/mock-exam/${mockExamId}/main-question`, {
        mainQuestionsId: ids,
      }),
    onSuccess: (updated) => {
      updateRefs(updated);

      qc.invalidateQueries({ queryKey: ["get-main-questions"] });
      qc.invalidateQueries({ queryKey: ["get-mock-exam"] });

      successAlert("Questão principal removida com sucesso");
    },
  });

  return { addMainQUestion, removeMainQuestion };
}
