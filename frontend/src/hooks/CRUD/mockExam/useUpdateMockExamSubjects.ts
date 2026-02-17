import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { successAlert } from "@/utils/toastAlerts";

export function useUpdateMockExamSubjects(mockExamId: string) {
  const queryClient = useQueryClient();

  const addSubjects = useMutation({
    mutationFn: (subjectsId: string[]) =>
      apiService.patch(`/mock-exam/${mockExamId}/subject`, { subjectsId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-mock-exam", mockExamId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-subjects"] });
      successAlert("Assunto(s) adicionado(s) com sucesso!");
    },
  });

  const removeSubjects = useMutation({
    mutationFn: (subjectsId: string[]) =>
      apiService.delete(`/mock-exam/${mockExamId}/subject`, {
        data: { subjectsId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-mock-exam", mockExamId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-subjects"] });
      successAlert("Assunto(s) removido(s) com sucesso!");
    },
  });

  return { addSubjects, removeSubjects };
}
