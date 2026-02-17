import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { successAlert } from "@/utils/toastAlerts";
import { SubjectFormOutput } from "@/components/Subject/SubjectSchema";

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
