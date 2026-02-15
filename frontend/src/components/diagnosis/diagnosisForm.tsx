import { Check, Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/shadcn/button";
import { DevTool } from "@hookform/devtools";
import { DragDropPreviewFileUploader } from "../ui/drag-drop/dragDropPreviewFile";
import { studentRecordsSchema } from "./diagnosisSchema";
import { InfiniteSelect } from "../ui/select/infiniteSelect";
import { MockExam, PageResponse } from "../../interfaces";
import { QueryKey, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { successAlert, warningAlert } from "../../utils/toastAlerts";
import { MockExamDiagnosisResponse } from "../../interfaces/MockExamResponse";

type GenerateStudentsResponseForm = z.infer<typeof studentRecordsSchema>;

interface QueryFunctionContext {
  queryKey: QueryKey;
  pageParam?: unknown;
  signal: AbortSignal;
  meta?: Record<string, unknown>;
}

type SelectOptionProps = {
  label: string;
  value: string;
};

type GenerateResponsesFormProps = {
  setStudentResponseList: React.Dispatch<
    React.SetStateAction<MockExamDiagnosisResponse[]>
  >;
  selectPlaceholder: string;
  dragAndDropPlaceholder: string;
};

export function GenerateResponsesForm({
  setStudentResponseList,
  selectPlaceholder,
  dragAndDropPlaceholder,
}: GenerateResponsesFormProps) {
  const [mockExamOptionsList, setMockExamOptionsList] = useState<
    SelectOptionProps[]
  >([]);

  const formMethods = useForm<GenerateStudentsResponseForm>({
    resolver: zodResolver(studentRecordsSchema),
    defaultValues: {
      mockExamSelected: { label: "", value: "" },
      studentRecordsExcelFile: undefined,
    },
  });
  const { handleSubmit, setValue, watch, formState, control } = formMethods;

  const watchedSelectedOption = watch("mockExamSelected");

  async function fetchMockExamList(context: QueryFunctionContext) {
    const { pageParam } = context;
    const pageNumber = typeof pageParam === "number" ? pageParam : 0;

    const response = await fetch(
      `http://localhost:8080/mock-exam?pageNumber=${pageNumber}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const requestData: PageResponse<MockExam> = await response.json();
    const options =
      requestData?.data.map((mockExam) => {
        const { id, releasedYear, number, className } = mockExam;
        const code = `${releasedYear}:S${number} - ${className[0]}`;
        return {
          label: code,
          value: id,
        };
      }) ?? [];
    setMockExamOptionsList((prev) => [...prev, ...options]);

    return requestData;
  }

  const { fetchNextPage, isFetchingNextPage, hasNextPage, isFetching } =
    useInfiniteQuery<PageResponse<MockExam>>({
      queryKey: ["items"],
      queryFn: fetchMockExamList,
      initialPageParam: 0,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.pages - 1
          ? lastPage.currentPage + 1
          : undefined,
    });

  const { lastEntryRef } = useIntersectionObserver<MockExam>({
    isFetching,
    hasNextPage,
    fetchNextPage,
  });

  const generateStudentsResponse = useMutation({
    mutationFn: async ({
      mockExamSelected,
      studentRecordsExcelFile,
    }: GenerateStudentsResponseForm) => {
      const formData = new FormData();
      formData.append("studentsMockExamsAnswers", studentRecordsExcelFile);

      const response = await fetch(
        `http://localhost:8080/mock-exam/${mockExamSelected.value}/responses`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.status === 200) {
        const responseList: MockExamDiagnosisResponse[] = await response.json();
        setStudentResponseList(responseList);
        successAlert(
          `Respostas para o simulado ${mockExamSelected.label} salvas com sucesso!`,
        );
      }

      if (response.status === 400) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    },
  });

  async function handleUploadFile(data: GenerateStudentsResponseForm) {
    await generateStudentsResponse.mutateAsync(data);
  }

  function disableSubmitButton() {
    const { mockExamSelected, studentRecordsExcelFile } = watch();
    return (
      formState.isSubmitting ||
      !mockExamSelected.value ||
      !studentRecordsExcelFile
    );
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleUploadFile)}
        encType="multipart/form-data"
        className="w-full space-y-6"
      >
        <div className="flex flex-col gap-3 justify-around align-middle">
          <div className="block w-52">
            <span className="block mb-2 text-sm mt-4">{selectPlaceholder}</span>
            <div>
              <InfiniteSelect
                options={mockExamOptionsList}
                selected={watchedSelectedOption}
                placeholder={selectPlaceholder}
                handleSelect={(option: SelectOptionProps) =>
                  setValue("mockExamSelected", option)
                }
                isFetchingOptions={isFetchingNextPage}
                lastOptionRef={lastEntryRef}
              />
            </div>
          </div>
          <div className="space-y-2 flex flex-col justify-center items-center">
            <DragDropPreviewFileUploader
              formVariable="studentRecordsExcelFile"
              message={dragAndDropPlaceholder}
            />
            <p
              className={`text-sm ${formState.errors?.studentRecordsExcelFile ? "text-red-400" : "text-transparent"}`}
            >
              {formState.errors?.studentRecordsExcelFile
                ? formState.errors.studentRecordsExcelFile.message
                : "\u00A0"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            disabled={disableSubmitButton()}
            className="bg-teal-400 text-teal-950"
            type="submit"
          >
            {formState.isSubmitting ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Check className="size-3" />
            )}
            Processar Respostas
          </Button>
        </div>
      </form>
      <DevTool control={control} />
    </FormProvider>
  );
}
