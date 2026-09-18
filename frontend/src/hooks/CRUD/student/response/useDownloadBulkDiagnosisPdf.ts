import { studentResponseService } from "@/service/studentResponseService";
import { downloadFile } from "@/utils/downloadFile";
import { useMutation } from "@tanstack/react-query";

export function useDownloadBulkDiagnosisPdf() {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await studentResponseService.downloadBulkDiagnosisPdf(ids);

      const disposition = response.headers["content-disposition"];
      const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/);
      const fileName = fileNameMatch?.[1] ?? "diagnosticos.zip";

      return { blob: response.data, fileName };
    },
    onSuccess: ({ blob, fileName }) => {
      downloadFile(blob, fileName);
    },
  });
}
