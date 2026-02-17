import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { CreateMockExam } from "@/interfaces/MockExam";
import { CLASS_GROUP } from "@/constants/students";
import { MockExamFormType } from "@/components/MockExam/MockExamSchema";

export function useHandleCreateMockExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MockExamFormType) => {
      const formData = new FormData();

      const {
        name,
        className,
        releasedYear,
        number,
        coverPdfFile,
        matrixPdfFile,
        answersPdfFile,
      } = data;

      formData.append("coverPdfFile", coverPdfFile);
      formData.append("matrixPdfFile", matrixPdfFile);
      formData.append("answersPdfFile", answersPdfFile);

      const payload: CreateMockExam = {
        name,
        className: [className as CLASS_GROUP],
        releasedYear,
        number: Number(number),
      };

      formData.append(
        "mockExamInputDto",
        new Blob([JSON.stringify(payload)], {
          type: "application/json",
        }),
      );

      return apiService.postMultipart("/mock-exam", formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-mock-exams"],
      });
    },
  });
}
