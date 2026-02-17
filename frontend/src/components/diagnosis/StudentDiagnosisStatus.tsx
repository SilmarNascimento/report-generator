import { MockExamDiagnosisResponse } from "@/interfaces/MockExamResponse";
import { ArrowBigDownDash, FileUp } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { DragDropFileUploader } from "../ui/drag-drop/dragDropFile";
import {
  responseStatusSchema,
  StudentDiagnosisStatusFormType,
} from "./diagnosisSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { downloadFile } from "@/utils/downloadFile";
import { useUploadPersonalRecord } from "@/hooks/CRUD/mockExam/diagnosis/useUploadPersonalRecord";
import { useDownloadDiagnosisPdf } from "@/hooks/CRUD/mockExam/diagnosis/useDownloadDiagnosisPdf";

type StudentResponseHandlerProps = {
  studentResponse: MockExamDiagnosisResponse;
};

export function StudentDiagnosisStatus({
  studentResponse,
}: StudentResponseHandlerProps) {
  const formMethods = useForm<StudentDiagnosisStatusFormType>({
    resolver: zodResolver(responseStatusSchema),
  });

  const { watch } = formMethods;
  const fileSelected = watch("studentRecord");

  const uploadMutation = useUploadPersonalRecord(
    studentResponse.id,
    studentResponse.name,
  );
  const downloadQuery = useDownloadDiagnosisPdf(studentResponse.id);

  const handleDownload = async () => {
    const result = await downloadQuery.refetch();

    if (result.data) {
      downloadFile(result.data.blob, result.data.fileName);
    }
  };

  const handleUpload = async () => {
    if (!fileSelected) return;
    await uploadMutation.mutateAsync(fileSelected);
  };

  if (studentResponse.hasDiagnosisPdfFile) {
    return (
      <div className="flex flex-col gap-1 justify-center align-middle">
        <button
          onClick={handleDownload}
          disabled={downloadQuery.isFetching}
          className="flex justify-center align-middle font-light"
        >
          {downloadQuery.isFetching ? (
            "Baixando..."
          ) : (
            <ArrowBigDownDash className="size-6" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium">Incompleto</span>
      <FormProvider {...formMethods}>
        <DragDropFileUploader formVariable="studentRecord" />
      </FormProvider>
      <button
        onClick={handleUpload}
        disabled={!fileSelected || uploadMutation.isPending}
        className="font-light text-zinc-300/70"
      >
        <FileUp className="size-4" />
      </button>
    </div>
  );
}
