import { MockExamDiagnosisResponse } from '../../interfaces/MockExamResponse';
import { useDownloadPdf } from '../../hooks/useDownloadPdf';
import { ArrowBigDownDash, FileUp } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { successAlert } from '../../utils/toastAlerts';
import { FormProvider, useForm } from 'react-hook-form';
import { DragDropFileUploader } from '../ui/drag-drop/dragDropFile';
import { z } from 'zod';
import { responseStatusSchema } from './diagnosisSchema';
import { zodResolver } from '@hookform/resolvers/zod';

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

type StudentDiagnosisStatusForm = z.infer<typeof responseStatusSchema>

export function StudentDiagnosisStatus({ studentResponse }: StudentResponseHandlerProps) {
  const queryClient = useQueryClient();
  const downloadUrl = `http://localhost:8080/students-response/${studentResponse.id}/download`;
  const uploadUrl = `http://localhost:8080/students-response/${studentResponse.id}`;
  const { isLoading, refetch } = useDownloadPdf(downloadUrl);
  
  const formMethods = useForm<StudentDiagnosisStatusForm>({
    resolver: zodResolver(responseStatusSchema)
  });
  const { watch } = formMethods;
  const fileSelected = watch("studentRecord");
  
  const uploadPersonalRecords = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("personalRecordPdfFile", file);

      await fetch(uploadUrl,
      {
        method: 'PATCH',
        body: formData
      })
      
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-responses'],
      });
      successAlert(`Relatório pessoal do aluno ${studentResponse.name} atualizado com sucesso!`);
    }
  })

  async function handleDownload() {
    const refetchDownload = await refetch();
    const { data } = refetchDownload;

    if (data) {
      console.log(data.fileName);
      
      downloadFile(data.blob, data.fileName);
    }
  }

  async function handleClick() {
    await uploadPersonalRecords.mutateAsync(fileSelected);
  }

  if (studentResponse.hasDiagnosisPdfFile) {
    return (
      <div className="flex flex-col gap-1 justify-center align-middle">
        {/* <span className="font-normal text-zinc-300">Completo</span> */}
        <button onClick={handleDownload} className="flex justify-center align-middle font-light text-zinc-300/70" disabled={isLoading}>
          {isLoading ? 'Baixando...' : <ArrowBigDownDash className="size-6" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="font-normal text-zinc-300">Incompleto</span>
      <FormProvider {...formMethods}>
        <DragDropFileUploader
          formVariable="studentRecord"
        />
      </FormProvider>
      <button
        onClick={handleClick}
        disabled={!fileSelected}
        className="font-light text-zinc-300/70">
        <FileUp className="size-4" />
      </button>
    </div>
  );
}

