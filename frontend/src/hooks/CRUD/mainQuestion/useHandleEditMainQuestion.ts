import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mainQuestionService } from "@/service/mainQuestionService";
import { successAlert, warningAlert } from "@/utils/toastAlerts";

export function useHandleEditMainQuestion(mainQuestionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      mainQuestionService.update(mainQuestionId, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-main-questions"],
      });
      successAlert("Questão principal alterada com sucesso!");
    },

    onError: () => {
      warningAlert("Erro ao atualizar questão principal");
    },
  });
}
