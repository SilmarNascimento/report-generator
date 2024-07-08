import { useQuery } from '@tanstack/react-query';
import { warningAlert } from '../utils/toastAlerts';

export function useDownloadPdf(url: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['get-pdf-file', url],
    queryFn: async () => {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        warningAlert('Erro ao fazer download do arquivo');
        return;
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      
      let fileName = 'diagnosis.pdf'; // Nome padrão

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length > 1) {
          fileName = fileNameMatch[1];
        }
      }

      const blob = await response.blob();
      return { blob, fileName };
    },
    enabled: false,
  });

  return { data, isLoading, error, refetch };
}
