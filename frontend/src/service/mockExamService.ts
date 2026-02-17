import { MockExam, PageResponse } from "@/interfaces";
import { MockExamDiagnosisResponse } from "@/interfaces/MockExamResponse";
import apiService from "./ApiService";

export const mockExamService = {
  getPage(pageNumber: number) {
    return apiService.get<PageResponse<MockExam>>("/mock-exam", {
      pageNumber,
    });
  },

  uploadResponses(mockExamId: string, file: File) {
    const formData = new FormData();
    formData.append("studentsMockExamsAnswers", file);

    return apiService.postMultipart<MockExamDiagnosisResponse[]>(
      `/mock-exam/${mockExamId}/responses`,
      formData,
    );
  },
};
