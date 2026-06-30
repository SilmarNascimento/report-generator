import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/service/dashboardService";

export function useIndividualDashboard(
  studentId: string | null,
  year: string,
  mockExamIds: string[]
) {
  return useQuery({
    queryKey: ["dashboard-individual", studentId, year, mockExamIds],
    queryFn: () =>
      dashboardService.getIndividual(studentId!, year, mockExamIds),
    enabled: !!studentId && !!year,
  });
}
