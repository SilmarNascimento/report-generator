import { studentResponseService } from "@/service/studentResponseService";
import { useQuery } from "@tanstack/react-query";

export function useDownloadDiagnosisPdf(id: string) {
  return useQuery({
    queryKey: ["diagnosis-pdf", id],
    queryFn: async () => {
      const blob = await studentResponseService.downloadDiagnosisPdf(id);

      return {
        blob,
        fileName: `diagnostico-${id}.pdf`,
      };
    },
    enabled: false,
  });
}
