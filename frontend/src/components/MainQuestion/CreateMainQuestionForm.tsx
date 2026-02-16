import { Check, Loader2, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/shadcn/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlternativeForm } from "../Alternative/AlternativesForm";
import { MainQuestionSchema } from "./MainQuestionSchema";
import { CreateQuestion } from "../../interfaces/MainQuestion";
import { CreateAlternative } from "../../interfaces/Alternative";
import { useNavigate } from "react-router-dom";
import { SelectLevel } from "../ui/SelectLevel";
import { successAlert, warningAlert } from "../../utils/toastAlerts";
import { AlternativeSchema } from "../Alternative/AlternativeSchema";
import { DragDropPreviewFileUploader } from "../ui/drag-drop/DragDropPreviewFile";
import { useEffect } from "react";
import { SelectLerikucas } from "../ui/SelectLerikucas";
import { SelectPattern } from "../ui/SelectPattern";

type CreateMainQuestionForm = z.infer<typeof MainQuestionSchema>;

export function CreateMainQuestionForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formMethods = useForm<CreateMainQuestionForm>({
    resolver: zodResolver(MainQuestionSchema),
  });
  const { register, handleSubmit, formState, watch, setValue } = formMethods;

  const selectedLerikucas = watch("lerikucas");

  useEffect(() => {
    if (!selectedLerikucas) return;

    const lerikucasValue = Number(selectedLerikucas);
    let calculatedLevel: "Fácil" | "Médio" | "Difícil" | "" = "";

    if ([1, 2, 5].includes(lerikucasValue)) {
      calculatedLevel = "Fácil";
    } else if ([3, 6].includes(lerikucasValue)) {
      calculatedLevel = "Médio";
    } else if ([4, 7, 8].includes(lerikucasValue)) {
      calculatedLevel = "Difícil";
    }

    if (calculatedLevel) {
      setValue("level", calculatedLevel, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedLerikucas, setValue]);

  const createMainQuestion = useMutation({
    mutationFn: async (data: CreateMainQuestionForm) => {
      const formData = new FormData();
      let titleImage: File[] = [];
      const alternativeImages: File[] = [];

      if (data.images) {
        titleImage = Array.from(data?.images).filter(
          (file): file is File => file !== undefined,
        );
      }

      const alternatives: z.infer<typeof AlternativeSchema>[] =
        data.alternatives;
      for (const alternative of alternatives) {
        if (alternative.images) {
          const files = Array.from(alternative.images).filter(
            (file): file is File => file !== undefined,
          );
          alternativeImages.push(...files);
        }
      }

      const totalImages = titleImage.concat(alternativeImages);
      totalImages.forEach((file) => {
        formData.append("images", file);
      });

      const createAlternatives = data.alternatives.map((alternative, index) => {
        const createAlternative: CreateAlternative = {
          description: alternative?.description,
          questionAnswer: Number(data.questionAnswer) === index,
        };
        return createAlternative;
      });
      const mainQuestion: CreateQuestion = {
        title: data.title,
        level: data.level,
        lerickucas: Number(data.lerikucas),
        pattern: data.pattern,
        alternatives: createAlternatives,
        videoResolutionUrl: data.videoResolutionUrl,
      };
      const json = JSON.stringify(mainQuestion);
      const blob = new Blob([json], {
        type: "application/json",
      });

      formData.append("mainQuestionInputDto", blob);
      formData.append("adaptedQuestionPdfFile", data.adaptedQuestionsPdfFile);

      const response = await fetch("/main-question", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ["get-main-questions"],
        });
        successAlert("Questão principal salva com sucesso!");
        navigate("/main-questions");
      }

      if (response.status === 400) {
        const errorMessage = await response.text();
        warningAlert(errorMessage);
      }
    },
  });

  async function handleCreateMainQuestion(data: CreateMainQuestionForm) {
    await createMainQuestion.mutateAsync(data);
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleCreateMainQuestion)}
        encType="multipart/form-data"
        className="w-full space-y-6"
      >
        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="enunciado">
            Enunciado
          </label>
          <textarea
            {...register("title")}
            id="enunciado"
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm h-auto"
          />
          <p
            className={`text-sm ${formState.errors?.title ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.title
              ? formState.errors.title.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="images">
            Escolha imagens para o enunciado
          </label>
          <input
            {...register("images")}
            id="images"
            type="file"
            multiple
            hidden
            accept="image/*,.pdf"
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p
            className={`text-sm ${formState.errors?.images ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.images
              ? formState.errors.images.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="level">
            Lerikucas
          </label>
          <SelectLerikucas />
          <p
            className={`text-sm ${formState.errors?.lerikucas ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.lerikucas
              ? formState.errors.lerikucas.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="level">
            Nível da questão
          </label>
          <SelectLevel />
          <p
            className={`text-sm ${formState.errors?.level ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.level
              ? formState.errors.level.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="level">
            Padrão da Questão
          </label>
          <SelectPattern />
          <p
            className={`text-sm ${formState.errors?.level ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.level
              ? formState.errors.level.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-center items-start">
          <label
            className="text-sm font-medium block"
            htmlFor="videoResolutionUrl"
          >
            Url da Resolução da Questão
          </label>
          <input
            {...register("videoResolutionUrl")}
            type="text"
            id="videoResolutionUrl"
            className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          />
          <p
            className={`text-sm ${formState.errors?.videoResolutionUrl ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.videoResolutionUrl
              ? formState.errors.videoResolutionUrl.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-3">
          <span className="text-lg font-medium">Alternativas</span>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <AlternativeForm
              key={index}
              index={index}
              errors={formState.errors}
            />
          ))}
        </div>

        <div className="flex flex-row gap-1 justify-around align-middle">
          <div className="space-y-2 flex flex-col justify-center items-start">
            <DragDropPreviewFileUploader
              formVariable="adaptedQuestionsPdfFile"
              message="Escolha o arquivo de questões adaptadas"
            />
            <p
              className={`text-sm ${formState.errors?.adaptedQuestionsPdfFile ? "text-red-400" : "text-transparent"}`}
            >
              {formState.errors?.adaptedQuestionsPdfFile
                ? formState.errors.adaptedQuestionsPdfFile.message
                : "\u00A0"}
            </p>
          </div>
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
