import { Check, Loader2, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/shadcn/button";
import { useNavigate } from "react-router-dom";
import { successAlert, warningAlert } from "../../utils/toastAlerts";
import { DragDropPreviewFileUploader } from "../ui/drag-drop/DragDropPreviewFile";
import { classGroupOptions } from "@/constants/students";
import { useHandleCreateMockExam } from "@/hooks/CRUD/mockExam/useHandleCreateMockExam";
import { MockExamFormType, MockExamSchema } from "./MockExamSchema.ts";
import { InputSelectDropdownWrapper } from "../Features/form-input/InputSelectDropdownWrapper";

export function CreateMockExamForm() {
  const navigate = useNavigate();
  const createMockExam = useHandleCreateMockExam();

  const formMethods = useForm<MockExamFormType>({
    resolver: zodResolver(MockExamSchema),
  });
  const { register, handleSubmit, formState, control } = formMethods;
  const { errors } = formState;

  async function onSubmit(data: MockExamFormType) {
    try {
      await createMockExam.mutateAsync(data);
      successAlert("Simulado salvo com sucesso!");
      navigate("/mock-exams");
    } catch {
      warningAlert("Erro ao salvar simulado");
    }
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
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

        <div className="flex w-full flex-col xl:max-w-85">
          <InputSelectDropdownWrapper
            name="className"
            control={control}
            errors={errors}
            label="Turma"
            placeholder="Digite a turma"
            options={classGroupOptions}
          />
        </div>

        <div className="flex flex-row gap-1 justify-around align-middle">
          <div className="space-y-2 flex flex-col justify-center items-start">
            <DragDropPreviewFileUploader
              formVariable="coverPdfFile"
              message="Escolha o arquivo para a capa do relatório"
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
            disabled={
              formState.isSubmitting ||
              !Object.keys(formState.dirtyFields).length
            }
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
          <Button onClick={() => navigate("/main-questions")}>
            <X className="size-3" />
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
