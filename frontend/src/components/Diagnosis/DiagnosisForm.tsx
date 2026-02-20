import { Check, Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/shadcn/button";
import {
  GenerateStudentsResponseFormType,
  studentRecordsSchema,
} from "./diagnosisSchema";
import { useMemo } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { useNavigate } from "react-router-dom";
import { useInfiniteMockExams } from "@/hooks/CRUD/mockExam/diagnosis/useInfiniteMockExams";
import { useGenerateResponses } from "@/hooks/CRUD/mockExam/diagnosis/useGenerateResponses";
import { InfiniteSelect } from "../ui/select/InfiniteSelect";
import { DragDropPreviewFileUploader } from "../ui/drag-drop/DragDropPreviewFile";

type SelectOptionProps = {
  label: string;
  value: string;
};

type GenerateResponsesFormProps = {
  selectPlaceholder: string;
  dragAndDropPlaceholder: string;
};

export function GenerateResponsesForm({
  selectPlaceholder,
  dragAndDropPlaceholder,
}: GenerateResponsesFormProps) {
  const navigate = useNavigate();

  const formMethods = useForm<GenerateStudentsResponseFormType>({
    resolver: zodResolver(studentRecordsSchema),
    defaultValues: {
      mockExamSelected: { label: "", value: "" },
      studentRecordsExcelFile: undefined,
    },
  });
  const { handleSubmit, setValue, watch, formState } = formMethods;

  const watchedSelectedOption = watch("mockExamSelected");

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteMockExams();

  const options: SelectOptionProps[] = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        page.data.map((mockExam) => {
          const code = `${mockExam.releasedYear}:S${mockExam.number} - ${mockExam.className[0]}`;
          return {
            label: code,
            value: mockExam.id,
          };
        }),
      ) ?? []
    );
  }, [data]);

  const { lastEntryRef } = useIntersectionObserver({
    isFetching,
    hasNextPage,
    fetchNextPage,
  });

  const generateMutation = useGenerateResponses();

  const onSubmit = async (formData: GenerateStudentsResponseFormType) => {
    await generateMutation.mutateAsync({
      mockExamId: formData.mockExamSelected.value,
      label: formData.mockExamSelected.label,
      file: formData.studentRecordsExcelFile,
    });

    navigate("/students-response");
  };

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
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="w-full space-y-6"
      >
        <div className="flex flex-col gap-3 justify-around align-middle">
          <div className="block w-52">
            <span className="block mb-2 text-sm mt-4">{selectPlaceholder}</span>
            <div>
              <InfiniteSelect
                options={options}
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
    </FormProvider>
  );
}
