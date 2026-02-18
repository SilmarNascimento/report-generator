import { Check, Loader2, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/shadcn/button";
import { useNavigate, useParams } from "react-router-dom";
import { MainQuestion } from "@/interfaces";
import { CreateAlternative } from "@/interfaces/Alternative";
import { CreateQuestion } from "@/interfaces/MainQuestion";
import { useEffect, useMemo } from "react";
import { DragDropPreviewFileUploader } from "../ui/drag-drop/DragDropPreviewFile";
import { useHandleEditMainQuestion } from "@/hooks/CRUD/mainQuestion/useHandleEditMainQuestion";
import {
  LerikucasEnum,
  LerikucasOptions,
  QuestionLevelEnum,
  questionLevelOptions,
  QuestionPatternEnum,
  questionPatternOptions,
} from "@/constants/general";
import { MainQuestionFormType, MainQuestionSchema } from "./MainQuestionSchema";
import { InputSelectDropdownWrapper } from "../Features/form-input/InputSelectDropdownWrapper";
import { AlternativeForm } from "../Alternative/AlternativesForm";

interface EditMainQuestionFormProps {
  entity: MainQuestion;
}

export function EditMainQuestionForm({
  entity: mainQuestion,
}: EditMainQuestionFormProps) {
  const { mainQuestionId = "" } = useParams<{ mainQuestionId: string }>();
  const navigate = useNavigate();

  const updateMutation = useHandleEditMainQuestion(mainQuestionId!);

  const memoizedDefaultValues = useMemo<MainQuestionFormType>(() => {
    return {
      title: mainQuestion.title,
      level: mainQuestion.level,
      lerikucas: String(mainQuestion.lerickucas) as LerikucasEnum,
      pattern: mainQuestion.pattern as unknown as QuestionPatternEnum,
      videoResolutionUrl: mainQuestion.videoResolutionUrl,
      adaptedQuestionsPdfFile: mainQuestion.adaptedQuestionPdfFile.file,
      questionAnswer: mainQuestion.alternatives
        .findIndex((a) => a.questionAnswer)
        .toString(),
      alternatives: mainQuestion.alternatives.map((a) => ({
        description: a.description,
      })),
    };
  }, [mainQuestion]);

  const formMethods = useForm<MainQuestionFormType>({
    resolver: zodResolver(MainQuestionSchema),
    defaultValues: memoizedDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { register, handleSubmit, formState, setValue, watch, reset, control } =
    formMethods;
  const { errors } = formState;

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [memoizedDefaultValues, reset]);

  const selectedLerikucas = watch("lerikucas");

  useEffect(() => {
    if (!selectedLerikucas) return;

    const lerikucasValue = Number(selectedLerikucas);
    let level: QuestionLevelEnum | undefined;

    if ([1, 2, 5].includes(lerikucasValue)) {
      level = QuestionLevelEnum.FACIL;
    } else if ([3, 6].includes(lerikucasValue)) {
      level = QuestionLevelEnum.MEDIO;
    } else if ([4, 7, 8].includes(lerikucasValue)) {
      level = QuestionLevelEnum.DIFICIL;
    }

    if (level !== undefined) {
      setValue("level", level, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedLerikucas, setValue]);

  function buildFormData(data: MainQuestionFormType) {
    const formData = new FormData();

    const titleImages = data.images ? Array.from(data.images) : [];

    const altImages = data.alternatives.flatMap((a) =>
      a.images ? Array.from(a.images) : [],
    );

    [...titleImages, ...altImages].forEach((file) =>
      formData.append("images", file),
    );

    const alternatives: CreateAlternative[] = data.alternatives.map((a, i) => ({
      description: a.description,
      questionAnswer: Number(data.questionAnswer) === i,
    }));

    const payload: CreateQuestion = {
      title: data.title,
      level: data.level,
      lerickucas: Number(data.lerikucas),
      pattern: data.pattern,
      alternatives,
      videoResolutionUrl: data.videoResolutionUrl,
    };

    formData.append(
      "mainQuestionInputDto",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      }),
    );

    if (data.adaptedQuestionsPdfFile) {
      formData.append("adaptedQuestionPdfFile", data.adaptedQuestionsPdfFile);
    }

    return formData;
  }

  async function handleEditMainQuestion(data: MainQuestionFormType) {
    const formData = buildFormData(data);
    await updateMutation.mutateAsync(formData);

    navigate("/main-questions");
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleEditMainQuestion)}
        className="w-full space-y-6"
        encType="multipart/form-data"
      >
        <div className="space-y-2 flex flex-col justify-center items-start">
          <label className="text-sm font-medium block" htmlFor="enunciado">
            Enunciado
          </label>
          <textarea
            {...register("title")}
            id="enunciado"
            className="border border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm"
          />
          <p
            className={`text-sm ${formState.errors?.title ? "text-red-400" : "text-transparent"}`}
          >
            {formState.errors?.title
              ? formState.errors.title.message
              : "\u00A0"}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium block" htmlFor="images">
            Escolha imagens para o enunciado
          </label>
          <input
            {...register("images")}
            id="images"
            type="file"
            multiple
            hidden
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

        <div className="flex flex-col max-w-85">
          <InputSelectDropdownWrapper
            name="lerikucas"
            control={control}
            errors={errors}
            label="Lerikucas"
            placeholder="Selecione o valor da lerikucas"
            options={LerikucasOptions}
          />
        </div>

        <div className="flex flex-col max-w-85">
          <InputSelectDropdownWrapper
            name="level"
            control={control}
            errors={errors}
            label="Nível"
            placeholder="Selecione o nível da questão"
            options={questionLevelOptions}
          />
        </div>

        <div className="flex flex-col max-w-85">
          <InputSelectDropdownWrapper
            name="pattern"
            control={control}
            errors={errors}
            label="Padrão da Questão"
            placeholder="Selecione o padrão da questão"
            options={questionPatternOptions}
          />
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
            className="border border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm"
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
        <div className="space-y-2">
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
          <Button onClick={() => navigate("/main-questions")}>
            <X className="size-3" />
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
