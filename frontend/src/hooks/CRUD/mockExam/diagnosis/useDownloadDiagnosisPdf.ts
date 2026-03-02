import { studentResponseService } from "@/service/studentResponseService";
import { useQuery } from "@tanstack/react-query";

export function useDownloadDiagnosisPdf(id: string) {
  return useQuery({
    queryKey: ["diagnosis-pdf", id],
    queryFn: async () => {
      const response = await studentResponseService.downloadDiagnosisPdf(id);

      const disposition = response.headers["content-disposition"];
      const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/);
      const fileName = fileNameMatch?.[1] ?? `diagnostico-${id}.pdf`;

      return {
        blob: response.data,
        fileName,
      };
    },
    enabled: false,
  });
}
