import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { successAlert } from "@/utils/toastAlerts";

export function useDeleteMainQuestionById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.delete<void>(`/main-question/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-main-questions"],
      });

      successAlert("Questão principal excluída com sucesso!");
    },
  });
}
