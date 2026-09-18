import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { InputDragDropWrapper } from "@/components/Features/form-input/InputDragDropWrapper";
import Botao from "../Shared/Botao";

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

  const { mockExamSelected, studentRecordsExcelFile } = watch();

  const hasFile = studentRecordsExcelFile instanceof File;

  const disabled =
    formState.isSubmitting || !mockExamSelected.value || !hasFile;

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
            <InputDragDropWrapper
              variant="preview"
              name="studentRecordsExcelFile"
              errors={formState.errors}
              message={dragAndDropPlaceholder}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Botao
            disabled={disabled}
            className="bg-teal-400 text-teal-950"
            type="submit"
          >
            Processar Respostas
          </Botao>
        </div>
      </form>
    </FormProvider>
  );
}
