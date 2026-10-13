import {
  DashboardMockExamOptionType,
  GlobalDashboardType,
  IndividualDashboardType,
} from "@/interfaces/dashboard";
import apiService from "./ApiService";

export const dashboardService = {
  getAvailableYears() {
    return apiService.get<number[]>("/mock-exam/available-years");
  },

  getGlobal(year: string, mockExamIds: string[]) {
    const params: Record<string, unknown> = { year };
    if (mockExamIds.length > 0) {
      params.mockExamIds = mockExamIds.join(",");
    }

    return apiService.get<GlobalDashboardType>("/dashboard/global", params);
  },

  getIndividual(studentId: string, year: string, mockExamIds: string[]) {
    const params: Record<string, unknown> = { year };
    if (mockExamIds.length > 0) {
      params.mockExamIds = mockExamIds.join(",");
    }

    return apiService.get<IndividualDashboardType>(
      `/dashboard/individual/${studentId}`,
      params,
    );
  },

  getIndividualMockExams(studentId: string, year: string) {
    return apiService.get<DashboardMockExamOptionType[]>(
      `/dashboard/individual/${studentId}/mock-exams`,
      { year },
    );
  },
};
