import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert } from "@/utils/toastAlerts";
import { useNavigate } from "react-router-dom";
import { mainQuestionService } from "@/service/mainQuestionService";

type CreateMainQuestionInput = {
  formData: FormData;
};

export function useHandleCreateMainQuestion() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ formData }: CreateMainQuestionInput) => {
      return mainQuestionService.create(formData);
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
