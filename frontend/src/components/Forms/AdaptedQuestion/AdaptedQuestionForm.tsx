import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CreateAlternative } from "@/interfaces/Alternative";
import { AlternativeForm } from "@/components/Alternative/AlternativesForm";
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
    () => defaultValues ?? { title: "", questionAnswer: "", alternatives: [] },
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
              className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
            />
            <p className={`text-sm ${errors?.title ? "text-red-400" : "text-transparent"}`}>
              {errors?.title ? errors.title.message : " "}
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
            <p className={`text-sm ${errors?.images ? "text-red-400" : "text-transparent"}`}>
              {errors?.images ? errors.images.message : " "}
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
                errors={errors as Parameters<typeof AlternativeForm>[0]["errors"]}
              />
            ))}
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
