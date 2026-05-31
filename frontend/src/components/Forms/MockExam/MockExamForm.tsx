import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { classGroupOptions } from "@/constants/students";
import { DragDropPreviewFileUploader } from "@/components/ui/drag-drop/DragDropPreviewFile";
import { InputSelectDropdownWrapper } from "@/components/Features/form-input/InputSelectDropdownWrapper";
import SessaoBotoesFormulario from "@/components/Shared/SessaoBotoesFormulario";
import { MockExamFormType, MockExamSchema } from "./MockExamSchema";
import { Input } from "@/components/ui/shadcn/Input";

type MockExamFormProps = {
  titulo: string;
  modo: "criacao" | "edicao";
  defaultValues?: MockExamFormType;
  fileUrls?: { cover?: string; matrix?: string; answers?: string };
  handleSubmitRequest: (data: MockExamFormType) => Promise<void>;
};

export function MockExamForm({
  titulo,
  modo,
  defaultValues,
  fileUrls,
  handleSubmitRequest,
}: MockExamFormProps) {
  const memoizedDefaultValues = useMemo(
    () => defaultValues ?? { name: "", releasedYear: "", number: "" },
    [defaultValues],
  );

  const formMethods = useForm<MockExamFormType>({
    resolver: zodResolver(MockExamSchema),
    defaultValues: memoizedDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { register, handleSubmit, formState, control } = formMethods;
  const { errors, isDirty } = formState;

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleSubmitRequest)}
        encType="multipart/form-data"
        className="flex min-h-[calc(100vh-360px)] flex-col justify-between gap-5.5 rounded-2xl px-6 py-8"
      >
        <section className="flex flex-col gap-6">
          <h1 className="text-lg leading-[1.4] font-bold tracking-[-0.25px] text-foreground">
            {titulo}
          </h1>

          <div className="space-y-2 flex flex-col justify-center items-start">
            <label className="text-sm font-medium block" htmlFor="name">
              Descrição
            </label>
            <Input
              {...register("name")}
              id="name"
              aria-invalid={!!errors?.name}
              className="h-10 rounded-lg py-2.5 text-sm"
            />
            <p className={`text-sm ${errors?.name ? "text-destructive" : "text-transparent"}`}>
              {errors?.name ? errors.name.message : " "}
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

          <div className="flex flex-row gap-4 min-w-0">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <DragDropPreviewFileUploader
                formVariable="coverPdfFile"
                message="Escolha o arquivo para a capa do relatório"
                url={fileUrls?.cover}
              />
              {errors?.coverPdfFile && (
                <p className="text-sm text-red-400">{errors.coverPdfFile.message as string}</p>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <DragDropPreviewFileUploader
                formVariable="matrixPdfFile"
                message="Escolha o arquivo para a matrix Lericucas do relatório"
                url={fileUrls?.matrix}
              />
              {errors?.matrixPdfFile && (
                <p className="text-sm text-red-400">{errors.matrixPdfFile.message as string}</p>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <DragDropPreviewFileUploader
                formVariable="answersPdfFile"
                message="Escolha o arquivo de respostas do relatório"
                url={fileUrls?.answers}
              />
              {errors?.answersPdfFile && (
                <p className="text-sm text-red-400">{errors.answersPdfFile.message as string}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 flex flex-col justify-center items-start">
            <label className="text-sm font-medium block" htmlFor="releasedYear">
              Ano de Emissão
            </label>
            <Input
              type="text"
              inputMode="numeric"
              {...register("releasedYear")}
              id="releasedYear"
              aria-invalid={!!errors?.releasedYear}
              className="h-10 rounded-lg py-2.5 text-sm"
            />
            <p className={`text-sm ${errors?.releasedYear ? "text-destructive" : "text-transparent"}`}>
              {errors?.releasedYear ? errors.releasedYear.message : " "}
            </p>
          </div>

          <div className="space-y-2 flex flex-col justify-center items-start">
            <label className="text-sm font-medium block" htmlFor="number">
              Número do Simulado
            </label>
            <Input
              type="text"
              inputMode="numeric"
              {...register("number")}
              id="number"
              aria-invalid={!!errors?.number}
              className="h-10 rounded-lg py-2.5 text-sm"
            />
            <p className={`text-sm ${errors?.number ? "text-destructive" : "text-transparent"}`}>
              {errors?.number ? errors.number.message : " "}
            </p>
          </div>
        </section>

        <SessaoBotoesFormulario
          modo={modo}
          listagemEndpoint="/mock-exams"
          isDirty={isDirty}
        />
      </form>
    </FormProvider>
  );
}
