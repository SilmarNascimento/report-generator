import { studentResponseService } from "@/service/studentResponseService";
import { useQuery } from "@tanstack/react-query";

export function useDownloadDiagnosisPdf(id: string) {
  return useQuery({
    queryKey: ["diagnosis-pdf", id],
    queryFn: async () => {
      const response = await studentResponseService.downloadDiagnosisPdf(id);
      const blob = response.data;

      let fileName = `diagnostico-${id}.pdf`;

      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          fileName = decodeURIComponent(matches[1].replace(/['"]/g, ""));
        }
      }

      return {
        blob,
        fileName,
      };
    },
    enabled: false,
  });
}
