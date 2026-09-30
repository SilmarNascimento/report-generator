import apiService from "@/service/ApiService";
import { MainQuestionReceived } from "@/interfaces/MainQuestion";

export const mainQuestionService = {
  create(formData: FormData) {
    return apiService.post<MainQuestionReceived>("/main-question", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update(id: string, formData: FormData) {
    return apiService.put<void>(`/main-question/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
