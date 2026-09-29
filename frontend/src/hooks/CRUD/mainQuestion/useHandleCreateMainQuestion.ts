import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert, warningAlert } from "@/utils/toastAlerts";
import { useNavigate } from "react-router-dom";
import { mainQuestionService } from "@/service/mainQuestionService";

type CreateMainQuestionInput = {
  formData: FormData;
  subjectIds: string[];
};

export function useHandleCreateMainQuestion() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ formData, subjectIds }: CreateMainQuestionInput) => {
      const created = await mainQuestionService.create(formData);

      if (subjectIds.length) {
        try {
          await mainQuestionService.addSubjects(created.id, subjectIds);
        } catch {
          warningAlert(
            "Questão criada, mas houve um erro ao associar os assuntos selecionados.",
          );
        }
      }

      return created;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-main-questions"],
      });

      successAlert("Questão principal salva com sucesso!");
      navigate("/main-questions");
    },
  });
}
