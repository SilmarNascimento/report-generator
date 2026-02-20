import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { successAlert, warningAlert } from "@/utils/toastAlerts";

export function useHandleDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: string) => {
      await apiService.delete(`/students/${studentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-students"] });
      successAlert("Estudante excluído com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir estudante:", error);
      warningAlert("Não foi possível excluir o estudante.");
    },
  });
}
