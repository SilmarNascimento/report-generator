import {
  formularioUsuarioSchema,
  FormularioUsuarioType,
} from "./formularioUsuarioSchema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownType } from "@/types/general";
import { useMemo, useState } from "react";
import { InputTextWrapper } from "@/components/features/formularioInput/InputTextWrapper";
import SessaoBotoesFormulario from "@/components/shared/SessaoBotoesFormulario";
import { InputDropdownWrapper } from "@/components/features/formularioInput/InputDropdownWrapper";
import { InputSelectDropdownWrapper } from "@/components/features/formularioInput/InputSelectDropdownWrapper";

export type FormularioUsuarioProps = {
  titulo: string;
  modo: "criacao" | "edicao" | "visualizacao";
  defaultValues?: FormularioUsuarioType;
  perfilDefaultValue: string;
  handleSubmitRequest?: (data: FormularioUsuarioType) => Promise<void>;
  turmaDropdown?: DropdownType[];
  anoMatriculaDropdown?: DropdownType[];
  opcoesPerfil?: DropdownType[];
};

const FormularioUsuario = ({
  titulo,
  modo,
  defaultValues,
  perfilDefaultValue,
  handleSubmitRequest,
  turmaDropdown,
  anoMatriculaDropdown,
  opcoesPerfil,
}: FormularioUsuarioProps) => {
  const [queryTurma, setQueryTurma] = useState<string>("");
  const [queryAnoMatricula, setQueryAnoMatricula] = useState<string>("");

  const isReadOnly = modo === "visualizacao";

  const memoizedDefaultValues = useMemo(() => {
    return defaultValues
      ? formularioUsuarioSchema.parse(defaultValues)
      : {
          nomeUsuario: "",
          turma: "",
          anoMatricula: undefined,
          emailUsuario: "",
          cpf: "",
          dataAtivacao: "",
          perfilId: "",
          foto: "",
          endereco: "",
        };
  }, [defaultValues]);

  const methods = useForm<FormularioUsuarioType>({
    resolver: zodResolver(formularioUsuarioSchema),
    defaultValues: memoizedDefaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={
          handleSubmitRequest
            ? handleSubmit(handleSubmitRequest)
            : (event) => event.preventDefault()
        }
        className="flex min-h-[calc(100vh-360px)] flex-col justify-between gap-[1.375rem] rounded-2xl bg-[#FFFFFF] px-4 py-6 sm:px-6 sm:py-8 lg:px-6"
      >
        <div className="flex flex-col gap-4 sm:gap-6">
          <section className="flex flex-col">
            <div>
              <h1 className={`text-lg font-bold`}>{titulo}</h1>
            </div>

            <div className="flex flex-col gap-8 px-4 py-4 sm:gap-10 sm:px-[18px] sm:py-[14px] xl:grid xl:grid-cols-2 xl:gap-6">
              <div className="flex w-full flex-col xl:max-w-182">
                <InputTextWrapper
                  name={`nomeUsuario`}
                  control={control}
                  errors={errors}
                  label="Nome*"
                  placeholder="Digite o nome do Usuário"
                  isReadOnly={isReadOnly}
                />
              </div>

              <div className="flex w-full flex-row gap-4 flex-wrap">
                <div className="flex w-full flex-col xl:max-w-182">
                  <InputTextWrapper
                    name={`cpf`}
                    control={control}
                    errors={errors}
                    label="CPF*"
                    placeholder="Digite o CPF do usuário"
                    isReadOnly={isReadOnly}
                  />
                </div>
                <div className="flex w-full flex-col xl:max-w-182">
                  <InputTextWrapper
                    name={`emailUsuario`}
                    control={control}
                    errors={errors}
                    label="E-mail*"
                    placeholder="Digite o E-mail do usuário"
                    isReadOnly={isReadOnly}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row gap-4 flex-wrap">
                <div className="flex w-full flex-col xl:max-w-182">
                  <InputSelectDropdownWrapper
                    name="anoMatricula"
                    control={control}
                    errors={errors}
                    label="Ano de Matrícula*"
                    placeholder="Selecione um Ano de Matrícula"
                    isReadOnly={isReadOnly}
                    queryValue={queryAnoMatricula ?? ""}
                    options={anoMatriculaDropdown ?? []}
                    onQueryChange={(query) => setQueryAnoMatricula?.(query)}
                  />
                </div>

                <div className="flex w-full flex-col xl:max-w-182">
                  <InputSelectDropdownWrapper
                    name="turma"
                    control={control}
                    errors={errors}
                    label="Turma*"
                    placeholder="Selecione uma Turma"
                    isReadOnly={isReadOnly}
                    queryValue={queryTurma ?? ""}
                    options={turmaDropdown ?? []}
                    onQueryChange={(query) => setQueryTurma?.(query)}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col xl:max-w-182">
                <InputDropdownWrapper
                  name={`perfilId`}
                  control={control}
                  errors={errors}
                  label="Atribuir Perfil*"
                  defaultValue={perfilDefaultValue}
                  options={opcoesPerfil ?? []}
                  placeholder="Selecione um Perfil"
                  isReadOnly={isReadOnly}
                  className="text-base"
                />
              </div>
            </div>
          </section>
        </div>

        <SessaoBotoesFormulario
          modo={modo}
          listagemEndpoint="/usuarios"
          isDirty={isDirty}
        />
      </form>
    </FormProvider>
  );
};

export default FormularioUsuario;
