import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successAlert } from "@/utils/toastAlerts";
import { mockExamService } from "@/service/mockExamService";

export function useCopyMockExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mockExamId: string) => mockExamService.copy(mockExamId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mock-exams"],
      });

      successAlert("Simulado copiado com sucesso!");
    },
  });
}
