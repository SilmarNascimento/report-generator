import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { classGroupOptions } from "@/constants/students";
import { DragDropPreviewFileUploader } from "@/components/ui/drag-drop/DragDropPreviewFile";
import { InputSelectDropdownWrapper } from "@/components/Features/form-input/InputSelectDropdownWrapper";
import SessaoBotoesFormulario from "@/components/Shared/SessaoBotoesFormulario";
import { MockExamFormType, MockExamSchema } from "./MockExamSchema";

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
            <input
              type="text"
              {...register("name")}
              id="name"
              className="border border-input rounded-lg px-3 py-2.5 bg-background w-full text-sm"
            />
            <p className={`text-sm ${errors?.name ? "text-red-400" : "text-transparent"}`}>
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

          <div className="flex flex-row gap-1 justify-around align-middle">
            <div className="space-y-2 flex flex-col justify-center items-start">
              <DragDropPreviewFileUploader
                formVariable="coverPdfFile"
                message="Escolha o arquivo para a capa do relatório"
                url={fileUrls?.cover}
              />
              <p className={`text-sm ${errors?.coverPdfFile ? "text-red-400" : "text-transparent"}`}>
                {errors?.coverPdfFile ? errors.coverPdfFile.message : " "}
              </p>
            </div>

            <div className="space-y-2 flex flex-col justify-center items-start">
              <DragDropPreviewFileUploader
                formVariable="matrixPdfFile"
                message="Escolha o arquivo para a matrix Lericucas do relatório"
                url={fileUrls?.matrix}
              />
              <p className={`text-sm ${errors?.matrixPdfFile ? "text-red-400" : "text-transparent"}`}>
                {errors?.matrixPdfFile ? errors.matrixPdfFile.message : " "}
              </p>
            </div>

            <div className="space-y-2 flex flex-col justify-center items-start">
              <DragDropPreviewFileUploader
                formVariable="answersPdfFile"
                message="Escolha o arquivo de respostas do relatório"
                url={fileUrls?.answers}
              />
              <p className={`text-sm ${errors?.answersPdfFile ? "text-red-400" : "text-transparent"}`}>
                {errors?.answersPdfFile ? errors.answersPdfFile.message : " "}
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
              className="border border-input rounded-lg px-3 py-2.5 bg-background w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className={`text-sm ${errors?.releasedYear ? "text-red-400" : "text-transparent"}`}>
              {errors?.releasedYear ? errors.releasedYear.message : " "}
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
              className="border border-input rounded-lg px-3 py-2.5 bg-background w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className={`text-sm ${errors?.number ? "text-red-400" : "text-transparent"}`}>
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
