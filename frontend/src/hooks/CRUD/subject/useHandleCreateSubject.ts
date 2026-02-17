import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { SubjectFormOutput } from "@/components/subject/subjectSchema";
import { successAlert } from "@/utils/toastAlerts";

export function useHandleCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubjectFormOutput) => apiService.post("/subject", data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-subjects"],
      });

      successAlert("Assunto cadastrado com sucesso!");
    },
  });
}
