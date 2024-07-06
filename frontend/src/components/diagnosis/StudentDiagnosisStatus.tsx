import { MockExamDiagnosisResponse } from '../../interfaces/MockExamResponse';
import { useDownloadPdf } from '../../hooks/useDownloadPdf';
import { ArrowBigDownDash, FileUp } from 'lucide-react';

function downloadFile(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}

type StudentResponseHandlerProps = {
  studentResponse: MockExamDiagnosisResponse
}

export function StudentDiagnosisStatus({ studentResponse }: StudentResponseHandlerProps) {
  const url = `http://localhost:8080/students-response/${studentResponse.id}/download`;
  const { data, isLoading, refetch } = useDownloadPdf(url);

  const handleDownload = async () => {
    await refetch();
    if (data) {
      downloadFile(data.blob, data.fileName);
    }
  };

  if (studentResponse.hasDiagnosisPdfFile) {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-normal text-zinc-300">Completo</span>
        <button onClick={handleDownload} className="font-light text-zinc-300/70" disabled={isLoading}>
          {isLoading ? 'Baixando...' : <ArrowBigDownDash className="size-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="font-normal text-zinc-300">Incompleto</span>
      <span className="font-light text-zinc-300/70">
        <FileUp className="size-4" />
      </span>
    </div>
  );
}

