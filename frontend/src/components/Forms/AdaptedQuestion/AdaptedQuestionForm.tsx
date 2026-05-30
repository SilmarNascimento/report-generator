import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CreateAlternative } from "@/interfaces/Alternative";
import { AlternativeRadioGroup } from "@/components/Alternative/AlternativesForm";
import SessaoBotoesFormulario from "@/components/Shared/SessaoBotoesFormulario";
import { AdaptedQuestionFormType, AdaptedQuestionSchema } from "./AdaptedQuestionSchema";

type AdaptedQuestionFormProps = {
  titulo: string;
  modo: "criacao" | "edicao";
  defaultValues?: AdaptedQuestionFormType;
  handleSubmitRequest: (formData: FormData) => Promise<void>;
};

export function AdaptedQuestionForm({
  titulo,
  modo,
  defaultValues,
  handleSubmitRequest,
}: AdaptedQuestionFormProps) {
  const { mainQuestionId = "" } = useParams<{ mainQuestionId: string }>();

  const memoizedDefaultValues = useMemo(
    () => defaultValues ?? { title: "", level: "Fácil" as const, questionAnswer: "" },
    [defaultValues],
  );

  const formMethods = useForm<AdaptedQuestionFormType>({
    resolver: zodResolver(AdaptedQuestionSchema),
    defaultValues: memoizedDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { register, handleSubmit, formState, reset } = formMethods;
  const { errors, isDirty } = formState;

  useEffect(() => {
    if (modo === "edicao") {
      reset(memoizedDefaultValues);
    }
  }, [memoizedDefaultValues, reset, modo]);

  function buildFormData(data: AdaptedQuestionFormType): FormData {
    const formData = new FormData();

    const alternatives: CreateAlternative[] = [0, 1, 2, 3, 4].map((i) => ({
      questionAnswer: Number(data.questionAnswer) === i,
    }));

    const payload = {
      title: data.title,
      level: data.level,
      alternatives,
    };

    formData.append(
      "adaptedQuestionInputDto",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    return formData;
  }

  async function onSubmit(data: AdaptedQuestionFormType) {
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
              rows={4}
              className="border border-border rounded-lg px-3 py-2.5 w-full text-sm resize-none"
            />
            <p className={`text-sm ${errors?.title ? "text-destructive" : "text-transparent"}`}>
              {errors?.title ? errors.title.message : " "}
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-sm font-medium">Alternativas</span>
            <AlternativeRadioGroup />
            <p className={`text-sm ${errors?.questionAnswer ? "text-destructive" : "text-transparent"}`}>
              {errors?.questionAnswer ? "Defina uma resposta correta" : " "}
            </p>
          </div>
        </section>

        <SessaoBotoesFormulario
          modo={modo}
          listagemEndpoint={`/main-questions/${mainQuestionId}/adapted-questions`}
          isDirty={isDirty}
        />
      </form>
    </FormProvider>
  );
}
