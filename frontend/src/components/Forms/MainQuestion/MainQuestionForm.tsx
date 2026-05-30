import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { CreateAlternative } from "@/interfaces/Alternative";
import { CreateQuestion } from "@/interfaces/MainQuestion";
import {
  LerikucasOptions,
  QuestionLevelEnum,
  questionPatternOptions,
} from "@/constants/general";
import { InputSelectDropdownWrapper } from "@/components/Features/form-input/InputSelectDropdownWrapper";
import { AlternativeRadioGroup } from "@/components/Alternative/AlternativesForm";
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
    () =>
      defaultValues ?? {
        title: "",
        videoResolutionUrl: "",
        questionAnswer: "",
      },
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

    const alternatives: CreateAlternative[] = [0, 1, 2, 3, 4].map((i) => ({
      questionAnswer: Number(data.questionAnswer) === i,
    }));

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
        className="flex flex-col gap-6 rounded-2xl px-6 py-8"
      >
        <h1 className="text-lg leading-[1.4] font-bold tracking-[-0.25px] text-foreground">
          {titulo}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <section className="flex flex-col gap-6">
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium" htmlFor="enunciado">
                Enunciado
              </label>
              <textarea
                {...register("title")}
                id="enunciado"
                rows={5}
                className="border border-border rounded-lg px-3 py-2.5 w-full text-sm resize-none"
              />
              <p
                className={`text-sm ${errors?.title ? "text-destructive" : "text-transparent"}`}
              >
                {errors?.title ? errors.title.message : " "}
              </p>
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-full">
                <InputSelectDropdownWrapper
                  name="lerikucas"
                  control={control}
                  errors={errors}
                  label="Lerikucas"
                  placeholder="Selecione"
                  options={LerikucasOptions}
                />
              </div>

              <div className="w-full">
                <InputSelectDropdownWrapper
                  name="pattern"
                  control={control}
                  errors={errors}
                  label="Padrão"
                  placeholder="Selecione"
                  options={questionPatternOptions}
                />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <label
                className="text-sm font-medium"
                htmlFor="videoResolutionUrl"
              >
                URL da Resolução da Questão
              </label>
              <input
                {...register("videoResolutionUrl")}
                type="text"
                id="videoResolutionUrl"
                className="border border-border rounded-lg px-3 py-2.5 w-full text-sm"
              />
              <p
                className={`text-sm ${errors?.videoResolutionUrl ? "text-destructive" : "text-transparent"}`}
              >
                {errors?.videoResolutionUrl
                  ? errors.videoResolutionUrl.message
                  : " "}
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-medium">Alternativas</span>
              <AlternativeRadioGroup />
              <p
                className={`text-sm ${errors?.questionAnswer ? "text-destructive" : "text-transparent"}`}
              >
                {errors?.questionAnswer ? "Defina uma resposta correta" : " "}
              </p>
            </div>
          </section>

          <section className="hidden lg:flex flex-col">
            <DragDropPreviewFileUploader
              formVariable="adaptedQuestionsPdfFile"
              message="Escolha o arquivo de questões adaptadas"
              fullHeight
            />
            {errors?.adaptedQuestionsPdfFile && (
              <p className="text-sm text-destructive mt-1">
                {errors.adaptedQuestionsPdfFile.message as string}
              </p>
            )}
          </section>
        </div>

        <SessaoBotoesFormulario
          modo={modo}
          listagemEndpoint="/main-questions"
          isDirty={isDirty}
        />
      </form>
    </FormProvider>
  );
}
