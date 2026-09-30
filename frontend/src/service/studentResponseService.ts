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

  downloadDiagnosisPdf(id: string) {
    return apiService.getFullResponse<Blob>(
      `/students-response/${id}/download`,
    );
  },

  uploadPersonalRecord(id: string, file: File) {
    const formData = new FormData();
    formData.append("personalRecordPdfFile", file);

    return apiService.patch(`/students-response/${id}`, formData);
  },

  downloadBulkDiagnosisPdf(ids: string[]) {
    return apiService.postFullResponse<Blob>(`/students-response/bulk-download`, { ids }, { timeout: 60000 });
  },
};
