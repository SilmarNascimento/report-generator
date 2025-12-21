import { Check, Loader2, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SelectClass } from "../ui/selectClass";
import { successAlert, warningAlert } from "../../utils/toastAlerts";
import { mockExamSchema } from "./mockExamSchema";
import { DevTool } from "@hookform/devtools";
import { CreateMockExam } from "../../types/MockExam";
import { DragDropPreviewFileUploader } from "../ui/drag-drop/dragDropPreviewFile";
import { Route } from "@/router/mock-exams/create";

type CreateMockExamForm = z.infer<typeof mockExamSchema>;

export function CreateMockExamForm() {
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const formMethods = useForm<CreateMockExamForm>({
    resolver: zodResolver(mockExamSchema),
  });
  const { register, handleSubmit, formState, control } = formMethods;

  const createMockExam = useMutation({
    mutationFn: async (data: CreateMockExamForm) => {
      const formData = new FormData();
      const {
        name,
        className,
        releasedYear,
        number,
        coverPdfFile,
        matrixPdfFile,
        answersPdfFile,
      } = data;

      formData.append("coverPdfFile", coverPdfFile);
      formData.append("matrixPdfFile", matrixPdfFile);
      formData.append("answersPdfFile", answersPdfFile);

      const mockExam: CreateMockExam = {
        name,
        className: [className],
        releasedYear,
        number: Number(number),
      };
      const json = JSON.stringify(mockExam);
      const blob = new Blob([json], {
        type: "application/json",
      });

      formData.append("mockExamInputDto", blob);

      const response = await fetch("http://localhost:8080/mock-exam", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ["get-mock-exams"],
        });
        successAlert("Simulado salvo com sucesso!");
        navigate({ to: "/mock-exams" });
      }

      if (response.status === 400) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    },
  });

  async function handleCreateMainQuestion(data: CreateMockExamForm) {
    await createMockExam.mutateAsync(data);
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleCreateMainQuestion)}
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
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
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
              message="Escolha o arquivo para a capa do simulado"
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
              message="Escolha o arquivo para a matrix Lericucas do simulado"
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
              message="Escolha o arquivo de respostas do simulado"
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
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
          <Button
            onClick={() =>
              navigate({
                to: "/main-questions",
                search: { page: 1, pageSize: 10, query: "" },
              })
            }
          >
            <X className="size-3" />
            Cancel
          </Button>
        </div>
      </form>
      <DevTool control={control} />
    </FormProvider>
  );
}
