import { StudentImportResult } from "@/interfaces/Student";
import apiService from "@/service/ApiService";

export const studentService = {
  importStudents(studentsFile: File) {
    const formData = new FormData();
    formData.append("studentsFile", studentsFile);

    return apiService.postMultipart<StudentImportResult>(
      "/students/import",
      formData,
      { timeout: 60000 },
    );
  },
};
