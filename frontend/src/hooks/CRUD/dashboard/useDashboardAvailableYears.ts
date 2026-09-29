import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/service/dashboardService";

export function useDashboardAvailableYears() {
  return useQuery({
    queryKey: ["dashboard-available-years"],
    queryFn: () => dashboardService.getAvailableYears(),
  });
}
