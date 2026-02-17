import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert } from "@/utils/toastAlerts";
import { studentResponseService } from "@/service/studentResponseService";

export function useHandleDeleteStudentResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentResponseService.deleteById(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-responses"],
      });

      successAlert("Resposta do aluno para o simulado excluída com sucesso!");
    },
  });
}
