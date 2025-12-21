import { Check, Loader2, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MockExam } from "../../types";
import { successAlert, warningAlert } from "../../utils/toastAlerts";
import { mockExamSchema } from "./mockExamSchema";
import { SelectClass } from "../ui/selectClass";
import { useEffect, useState } from "react";
import { DevTool } from "@hookform/devtools";
import { CreateMockExam } from "../../types/MockExam";
import { DragDropPreviewFileUploader } from "../ui/drag-drop/dragDropPreviewFile";
import { Route } from "@/router/mock-exams/edit/$mockExamId";

type EditMockExamForm = z.infer<typeof mockExamSchema>;

interface EditMockExamFormProps {
  entity: MockExam;
}

export function EditMockExamForm({ entity: mockExam }: EditMockExamFormProps) {
  const [hasChanged, setHasChanged] = useState(false);
  const queryClient = useQueryClient();

  const { mockExamId } = Route.useParams();
  const navigate = Route.useNavigate();

  const formMethods = useForm<EditMockExamForm>({
    resolver: zodResolver(mockExamSchema),
  });
  const { register, handleSubmit, formState, setValue, watch, control } =
    formMethods;

  useEffect(() => {
    if (mockExam) {
      setValue("name", mockExam.name);
      setValue("className", mockExam.className[0]);
      setValue("releasedYear", mockExam.releasedYear.toString());
      setValue("coverPdfFile", mockExam.coverPdfFile.file);
      setValue("matrixPdfFile", mockExam.matrixPdfFile.file);
      setValue("answersPdfFile", mockExam.answersPdfFile.file);
      setValue("number", mockExam.number.toString());
    }
  }, [mockExam, setValue]);

  useEffect(() => {
    function hasChangedValues(): boolean {
      const classNameFormValues = watch("className");

      if (
        classNameFormValues !== mockExam?.className[0] ||
        !!Object.keys(formState.dirtyFields).length
      ) {
        return true;
      }

      return false;
    }

    setHasChanged(hasChangedValues());
  }, [formState, hasChanged, mockExam, watch]);

  const editMainQuestion = useMutation({
    mutationFn: async (data: EditMockExamForm) => {
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

      const response = await fetch(
        `http://localhost:8080/mock-exam/${mockExamId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ["get-mock-exams"],
        });
        successAlert("Simulado alterado com sucesso!");
        navigate({ to: "/mock-exams" });
      }

      if (response.status === 404) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    },
  });

  async function handleEditMockExam(data: EditMockExamForm) {
    await editMainQuestion.mutateAsync(data);
  }

  //console.log(watch());

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
              message="Escolha o arquivo para a matrix Lericucas do simulado"
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
              message="Escolha o arquivo de respostas do simulado"
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
            disabled={formState.isSubmitting || !hasChanged}
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
