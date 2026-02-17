import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert, warningAlert } from "@/utils/toastAlerts";
import { mockExamService } from "@/service/mockExamService";

export function useHandleEditMockExam(mockExamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      mockExamService.update(mockExamId, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-mock-exams"],
      });

      successAlert("Simulado alterado com sucesso!");
    },

    onError: (error: unknown) => {
      if (error instanceof Error) {
        warningAlert(error.message);
      } else {
        warningAlert("Erro ao atualizar simulado");
      }
    },
  });
}
