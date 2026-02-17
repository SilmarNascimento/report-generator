import { Check, Loader2, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/shadcn/button";
import { useNavigate, useParams } from "react-router-dom";
import { MockExam } from "../../interfaces";
import { CreateMockExam } from "../../interfaces/MockExam";
import { useHandleEditMockExam } from "@/hooks/CRUD/mockExam/useHandleEditMockExam";
import { mapMockExamToForm } from "@/mapper/mockExamMapper";
import { useMemo } from "react";
import { DragDropPreviewFileUploader } from "../ui/drag-drop/DragDropPreviewFile";
import { SelectClass } from "../ui/SelectClass";
import { MockExamFormType, MockExamSchema } from "./MockExamSchema.ts";

interface EditMockExamFormProps {
  entity: MockExam;
}

export function EditMockExamForm({ entity: mockExam }: EditMockExamFormProps) {
  const { mockExamId = "" } = useParams<{ mockExamId: string }>();
  const navigate = useNavigate();

  const memoizedDefaultValue = useMemo(
    () => mapMockExamToForm(mockExam),
    [mockExam],
  );

  const formMethods = useForm<MockExamFormType>({
    resolver: zodResolver(MockExamSchema),
    defaultValues: memoizedDefaultValue,
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { register, handleSubmit, formState } = formMethods;

  const updateMutation = useHandleEditMockExam(mockExamId);

  function buildFormData(data: MockExamFormType) {
    const formData = new FormData();

    formData.append("coverPdfFile", data.coverPdfFile);
    formData.append("matrixPdfFile", data.matrixPdfFile);
    formData.append("answersPdfFile", data.answersPdfFile);

    const payload: CreateMockExam = {
      name: data.name,
      className: [data.className],
      releasedYear: data.releasedYear,
      number: Number(data.number),
    };

    formData.append(
      "mockExamInputDto",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      }),
    );

    return formData;
  }

  async function handleEditMockExam(data: MockExamFormType) {
    const formData = buildFormData(data);
    await updateMutation.mutateAsync(formData);

    navigate("/mock-exams");
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleEditMockExam)}
        encType="multipart/form-data"
        className="w-full space-y-6"
      >
        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="name">
            Descrição
          </label>
          <input
            type="text"
            {...register("name")}
            id="name"
            className="border border-input rounded-lg px-3 py-2.5 bg-background w-full text-sm"
          />
          <p
            className={`text-sm ${formState.errors?.name ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.name ? formState.errors.name.message : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="level">
            Turma
          </label>
          <SelectClass />
          <p
            className={`text-sm ${formState.errors?.className ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.className
              ? formState.errors.className.message
              : "\u00A0"}
          </p>
        </div>

        <div className="flex flex-row gap-1 justify-around align-middle">
          <div className="space-y-2 flex flex-col justify-center items-start">
            <DragDropPreviewFileUploader
              formVariable="coverPdfFile"
              message="Escolha o arquivo para a capa do relatório"
              url={mockExam.coverPdfFile.url}
            />
            <p
              className={`text-sm ${formState.errors?.coverPdfFile ? "text-red-400" : "text-transparent"}`}
            >
              {formState.errors?.coverPdfFile
                ? formState.errors.coverPdfFile.message
                : "\u00A0"}
            </p>
          </div>

          <div className="space-y-2 flex flex-col justify-center items-start">
            <DragDropPreviewFileUploader
              formVariable="matrixPdfFile"
              message="Escolha o arquivo para a matrix Lericucas do relatório"
              url={mockExam.matrixPdfFile.url}
            />
            <p
              className={`text-sm ${formState.errors?.matrixPdfFile ? "text-red-400" : "text-transparent"}`}
            >
              {formState.errors?.matrixPdfFile
                ? formState.errors.matrixPdfFile.message
                : "\u00A0"}
            </p>
          </div>

          <div className="space-y-2 flex flex-col justify-center items-start">
            <DragDropPreviewFileUploader
              formVariable="answersPdfFile"
              message="Escolha o arquivo de respostas do relatório"
              url={mockExam.answersPdfFile.url}
            />
            <p
              className={`text-sm ${formState.errors?.answersPdfFile ? "text-red-400" : "text-transparent"}`}
            >
              {formState.errors?.answersPdfFile
                ? formState.errors.answersPdfFile.message
                : "\u00A0"}
            </p>
          </div>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="releasedYear">
            Ano de Emissão
          </label>
          <input
            type="number"
            {...register("releasedYear")}
            id="releasedYear"
            className="border border-input rounded-lg px-3 py-2.5 bg-background w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p
            className={`text-sm ${formState.errors?.releasedYear ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.releasedYear
              ? formState.errors.releasedYear.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="number">
            Número do Simulado
          </label>
          <input
            type="number"
            {...register("number")}
            id="number"
            className="border border-input rounded-lg px-3 py-2.5 bg-background w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p
            className={`text-sm ${formState.errors?.number ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.number
              ? formState.errors.number.message
              : "\u00A0"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            disabled={formState.isSubmitting || !formState.isDirty}
            className="bg-teal-400 text-teal-950"
            type="submit"
          >
            {formState.isSubmitting ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Check className="size-3" />
            )}
            Save
          </Button>
          <Button onClick={() => navigate("/mock-exams")}>
            <X className="size-3" />
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
