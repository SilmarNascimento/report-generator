import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { CreateAlternative } from "@/interfaces/Alternative";
import { CreateQuestion } from "@/interfaces/MainQuestion";
import {
  LerikucasOptions,
  QuestionLevelEnum,
  questionLevelOptions,
  questionPatternOptions,
} from "@/constants/general";
import { InputSelectDropdownWrapper } from "@/components/Features/form-input/InputSelectDropdownWrapper";
import { AlternativeForm } from "@/components/Alternative/AlternativesForm";
import { DragDropPreviewFileUploader } from "@/components/ui/drag-drop/DragDropPreviewFile";
import SessaoBotoesFormulario from "@/components/Shared/SessaoBotoesFormulario";
import { MainQuestionFormType, MainQuestionSchema } from "./MainQuestionSchema";

type MainQuestionFormProps = {
  titulo: string;
  modo: "criacao" | "edicao";
  defaultValues?: MainQuestionFormType;
  handleSubmitRequest: (formData: FormData) => Promise<void>;
};

export function MainQuestionForm({
  titulo,
  modo,
  defaultValues,
  handleSubmitRequest,
}: MainQuestionFormProps) {
  const memoizedDefaultValues = useMemo(
    () => defaultValues ?? { title: "", videoResolutionUrl: "", questionAnswer: "", alternatives: [] },
    [defaultValues],
  );

  const formMethods = useForm<MainQuestionFormType>({
    resolver: zodResolver(MainQuestionSchema),
    defaultValues: memoizedDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { register, handleSubmit, formState, setValue, watch, reset, control } =
    formMethods;
  const { errors, isDirty } = formState;

  useEffect(() => {
    if (modo === "edicao") {
      reset(memoizedDefaultValues);
    }
  }, [memoizedDefaultValues, reset, modo]);

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
      setValue("level", level, { shouldValidate: true, shouldDirty: true });
    }
  }, [selectedLerikucas, setValue]);

  function buildFormData(data: MainQuestionFormType): FormData {
    const formData = new FormData();

    const titleImages = data.images
      ? Array.from(data.images).filter((f): f is File => !!f)
      : [];

    const altImages: File[] = [];
    for (const alt of data.alternatives) {
      if (alt.images) {
        altImages.push(...Array.from(alt.images).filter((f): f is File => !!f));
      }
    }

    [...titleImages, ...altImages].forEach((file) =>
      formData.append("images", file),
    );

    const alternatives: CreateAlternative[] = data.alternatives.map(
      (alt, i) => ({
        description: alt.description,
        questionAnswer: Number(data.questionAnswer) === i,
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
      new Blob([JSON.stringify(mainQuestion)], { type: "application/json" }),
    );

    if (data.adaptedQuestionsPdfFile) {
      formData.append("adaptedQuestionPdfFile", data.adaptedQuestionsPdfFile);
    }

    return formData;
  }

  async function onSubmit(data: MainQuestionFormType) {
    const formData = buildFormData(data);
    await handleSubmitRequest(formData);
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="flex min-h-[calc(100vh-360px)] flex-col justify-between gap-5.5 rounded-2xl px-6 py-8"
      >
        <section className="flex flex-col gap-6">
          <h1 className="text-lg leading-[1.4] font-bold tracking-[-0.25px] text-foreground">
            {titulo}
          </h1>

          <div className="space-y-2 flex flex-col justify-center items-start">
            <label className="text-sm font-medium block" htmlFor="enunciado">
              Enunciado
            </label>
            <textarea
              {...register("title")}
              id="enunciado"
              className="border border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm h-auto"
            />
            <p className={`text-sm ${errors?.title ? "text-red-400" : "text-transparent"}`}>
              {errors?.title ? errors.title.message : " "}
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
              className="border border-zinc-800 rounded-lg px-3 py-2.5 w-full text-sm"
            />
            <p className={`text-sm ${errors?.images ? "text-red-400" : "text-transparent"}`}>
              {errors?.images ? errors.images.message : " "}
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
            <p className={`text-sm ${errors?.videoResolutionUrl ? "text-red-400" : "text-transparent"}`}>
              {errors?.videoResolutionUrl
                ? errors.videoResolutionUrl.message
                : " "}
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-lg font-medium">Alternativas</span>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <AlternativeForm key={index} index={index} errors={errors} />
            ))}
          </div>

          <div className="flex flex-row gap-1 justify-around align-middle">
            <div className="space-y-2 flex flex-col justify-center items-start">
              <DragDropPreviewFileUploader
                formVariable="adaptedQuestionsPdfFile"
                message="Escolha o arquivo de questões adaptadas"
              />
              <p className={`text-sm ${errors?.adaptedQuestionsPdfFile ? "text-red-400" : "text-transparent"}`}>
                {errors?.adaptedQuestionsPdfFile
                  ? errors.adaptedQuestionsPdfFile.message
                  : " "}
              </p>
            </div>
          </div>
        </section>

        <SessaoBotoesFormulario
          modo={modo}
          listagemEndpoint="/main-questions"
          isDirty={isDirty}
        />
      </form>
    </FormProvider>
  );
}
