import apiService from "@/service/ApiService";

export const mainQuestionService = {
  create(formData: FormData) {
    return apiService.post("/main-question", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
