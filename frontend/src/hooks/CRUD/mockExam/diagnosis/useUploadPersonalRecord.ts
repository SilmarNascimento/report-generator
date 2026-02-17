import { studentResponseService } from "@/service/studentResponseService";
import { successAlert } from "@/utils/toastAlerts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadPersonalRecord(id: string, name: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      studentResponseService.uploadPersonalRecord(id, file),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-responses"],
      });

      successAlert(
        `Relatório pessoal do aluno ${name} atualizado com sucesso!`,
      );
    },
  });
}
