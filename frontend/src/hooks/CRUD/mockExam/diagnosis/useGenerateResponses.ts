import { useMutation } from "@tanstack/react-query";
import { successAlert } from "@/utils/toastAlerts";
import { MockExamDiagnosisResponse } from "@/interfaces/MockExamResponse";
import { mockExamService } from "@/service/mockExamService";

interface Payload {
  mockExamId: string;
  label: string;
  file: File;
  onSuccessData: (data: MockExamDiagnosisResponse[]) => void;
}

export function useGenerateResponses() {
  return useMutation({
    mutationFn: ({ mockExamId, file }: Payload) =>
      mockExamService.uploadResponses(mockExamId, file),

    onSuccess: (data, variables) => {
      variables.onSuccessData(data);
      successAlert(
        `Respostas para o simulado ${variables.label} salvas com sucesso!`,
      );
    },
  });
}
