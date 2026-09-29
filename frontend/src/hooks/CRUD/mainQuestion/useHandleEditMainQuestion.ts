import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mainQuestionService } from "@/service/mainQuestionService";
import { successAlert, warningAlert } from "@/utils/toastAlerts";

type EditMainQuestionInput = {
  formData: FormData;
  subjectIdsToAdd: string[];
  subjectIdsToRemove: string[];
};

export function useHandleEditMainQuestion(mainQuestionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      subjectIdsToAdd,
      subjectIdsToRemove,
    }: EditMainQuestionInput) => {
      await mainQuestionService.update(mainQuestionId, formData);

      if (subjectIdsToAdd.length) {
        try {
          await mainQuestionService.addSubjects(
            mainQuestionId,
            subjectIdsToAdd,
          );
        } catch {
          warningAlert(
            "Questão alterada, mas houve um erro ao associar os assuntos selecionados.",
          );
        }
      }

      if (subjectIdsToRemove.length) {
        try {
          await mainQuestionService.removeSubjects(
            mainQuestionId,
            subjectIdsToRemove,
          );
        } catch {
          warningAlert(
            "Questão alterada, mas houve um erro ao remover alguns assuntos.",
          );
        }
      }
    },

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
