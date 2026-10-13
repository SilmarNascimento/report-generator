import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/service/dashboardService";

export function useStudentMockExams(studentId: string | null, year: string) {
  return useQuery({
    queryKey: ["dashboard-student-mock-exams", studentId, year],
    queryFn: () => dashboardService.getIndividualMockExams(studentId!, year),
    enabled: !!studentId && !!year,
  });
}
