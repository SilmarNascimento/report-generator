import { Check, Loader2, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/shadcn/button";
import { AlternativeForm } from "../alternative/alternativesForm";
import { MainQuestionFormType, mainQuestionSchema } from "./mainQuestionSchema";
import { CreateQuestion } from "../../interfaces/MainQuestion";
import { CreateAlternative } from "../../interfaces/Alternative";
import { useNavigate } from "react-router-dom";
import { SelectLevel } from "../ui/selectLevel";
import { DragDropPreviewFileUploader } from "../ui/drag-drop/dragDropPreviewFile";
import { useEffect } from "react";
import { SelectLerikucas } from "../ui/selectLerikucas";
import { SelectPattern } from "../ui/selectPattern";
import { useHandleCreateMainQuestion } from "@/hooks/CRUD/mainQuestion/useHandleCreateMainQuestion";

export function CreateMainQuestionForm() {
  const navigate = useNavigate();
  const createMutation = useHandleCreateMainQuestion();

  const formMethods = useForm<MainQuestionFormType>({
    resolver: zodResolver(mainQuestionSchema),
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

  function buildFormData(data: MainQuestionFormType) {
    const formData = new FormData();

    const titleImages = data.images
      ? Array.from(data.images).filter((f): f is File => !!f)
      : [];

    const alternativeImages: File[] = [];
    for (const alt of data.alternatives) {
      if (alt.images) {
        alternativeImages.push(
          ...Array.from(alt.images).filter((f): f is File => !!f),
        );
      }
    }

    [...titleImages, ...alternativeImages].forEach((file) =>
      formData.append("images", file),
    );

    const alternatives: CreateAlternative[] = data.alternatives.map(
      (alt, index) => ({
        description: alt.description,
        questionAnswer: Number(data.questionAnswer) === index,
      }),
    );

    const mainQuestion: CreateQuestion = {
      title: data.title,
      level: data.level,
      lerickucas: Number(data.lerikucas),
      pattern: data.pattern,
      alternatives,
      videoResolutionUrl: data.videoResolutionUrl,
    };

    formData.append(
      "mainQuestionInputDto",
      new Blob([JSON.stringify(mainQuestion)], {
        type: "application/json",
      }),
    );

    formData.append("adaptedQuestionPdfFile", data.adaptedQuestionsPdfFile);

    return formData;
  }

  async function handleCreate(data: MainQuestionFormType) {
    const formData = buildFormData(data);
    await createMutation.mutateAsync(formData);
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleCreate)}
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
            className="border border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm h-auto"
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
            className="border border-zinc-800 rounded-lg px-3 py-2.5  w-full text-sm"
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
            className="border border-zinc-800 rounded-lg px-3 py-2.5  w-full text-sm"
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
              createMutation.isPending ||
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
          <Button type="button" onClick={() => navigate("/main-questions")}>
            <X className="size-3" />
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
