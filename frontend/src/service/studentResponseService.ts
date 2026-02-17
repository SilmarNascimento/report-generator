import apiService from "@/service/ApiService";

export const studentResponseService = {
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
