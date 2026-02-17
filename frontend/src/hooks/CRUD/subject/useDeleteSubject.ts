import { ApiError } from "@/interfaces/error";
import apiService from "@/service/ApiService";
import { successAlert, warningAlert } from "@/utils/toastAlerts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiService.delete(`/subject/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-subjects"] });
      successAlert("Assunto excluído com sucesso!");
    },
    onError: (error: ApiError) => {
      console.error("Erro ao deletar:", error);
      warningAlert("Não foi possível excluir o assunto.");
    },
  });
}
