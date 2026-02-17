import { PageResponse } from "@/interfaces";
import { MockExamDiagnosisResponse } from "@/interfaces/MockExamResponse";
import apiService from "@/service/ApiService";

export const studentResponseService = {
  getPage(params: { pageNumber: number; pageSize: number; query?: string }) {
    return apiService.get<PageResponse<MockExamDiagnosisResponse>>(
      "/students-response",
      params,
    );
  },

  deleteById(id: string) {
    return apiService.delete<void>(`/students-response/${id}`);
  },

  downloadDiagnosisPdf(id: string) {
    return apiService.get<Blob>(
      `/students-response/${id}/download`,
      {},
      undefined,
      { responseType: "blob" },
    );
  },

  uploadPersonalRecord(id: string, file: File) {
    const formData = new FormData();
    formData.append("personalRecordPdfFile", file);

    return apiService.patch(`/students-response/${id}`, formData);
  },
};
