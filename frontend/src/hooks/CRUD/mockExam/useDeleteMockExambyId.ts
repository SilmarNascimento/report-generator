import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert } from "@/utils/toastAlerts";
import apiService from "@/service/ApiService";

export function useDeleteMockExamById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mockExamId: string) =>
      apiService.delete(`/mock-exam/${mockExamId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mock-exams"],
      });

      successAlert("Simulado excluído com sucesso!");
    },
  });
}
