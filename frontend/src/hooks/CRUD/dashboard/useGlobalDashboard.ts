import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/service/dashboardService";

export function useGlobalDashboard(year: string, mockExamIds: string[]) {
  return useQuery({
    queryKey: ["dashboard-global", year, mockExamIds],
    queryFn: () => dashboardService.getGlobal(year, mockExamIds),
    enabled: !!year,
  });
}
