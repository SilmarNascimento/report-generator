import apiService from "@/service/ApiService";

export const mainQuestionService = {
  create(formData: FormData) {
    return apiService.post("/main-question", formData, {
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
