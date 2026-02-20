import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert, warningAlert } from "@/utils/toastAlerts";
import apiService from "@/service/ApiService";
import { SubjectFormOutput } from "@/components/Subject/SubjectSchema";

interface EditSubjectPayload extends SubjectFormOutput {
  subjectId: string;
}

export function useHandleEditSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subjectId, ...data }: EditSubjectPayload) =>
      apiService.put(`/subject/${subjectId}`, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-subjects"],
      });

      successAlert("Assunto alterado com sucesso!");
    },

    onError: () => {
      warningAlert("Erro ao alterar assunto");
    },
  });
}
