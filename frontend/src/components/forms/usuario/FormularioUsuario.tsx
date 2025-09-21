import {
  formularioUsuarioSchema,
  FormularioUsuarioType,
} from "./formularioUsuarioSchema";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownType } from "@/types/general";
import { useMemo } from "react";
import { InputTextWrapper } from "@/components/features/formularioInput/InputTextWrapper";
import SessaoBotoesFormulario from "@/components/shared/SessaoBotoesFormulario";
import { InputDropdownWrapper } from "@/components/features/formularioInput/InputDropdownWrapper";
import TabelaOrgaosUsuario from "@/components/shared/tabela/TabelaOrgaoUsuario";
import { InputSelectDropdownWrapper } from "@/components/features/formularioInput/InputSelectDropdownWrapper";
import { OrgaoDropdownType } from "@/types/orgao";

export type FormularioUsuarioProps = {
  titulo: string;
  modo: "edicao" | "visualizacao";
  defaultValues?: FormularioUsuarioType;
  perfilDefaultValue: string;
  handleSubmitRequest?: (data: FormularioUsuarioType) => Promise<void>;
  orgaosDropdown?: OrgaoDropdownType[];
  queryOrgao?: string;
  setQueryOrgao?: (query: string) => void;
  opcoesPerfil?: DropdownType[];
};

const FormularioUsuario = ({
  titulo,
  modo,
  defaultValues,
  perfilDefaultValue,
  handleSubmitRequest,
  orgaosDropdown,
  queryOrgao,
  setQueryOrgao,
  opcoesPerfil,
}: FormularioUsuarioProps) => {
  const isReadOnly = modo === "visualizacao";

  const memoizedDefaultValues = useMemo(() => {
    return defaultValues
      ? formularioUsuarioSchema.parse(defaultValues)
      : {
          nomeUsuario: "",
          orgaos: [],
          slugOrgaoPadrao: "",
          emailUsuario: "",
          perfilId: "",
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orgaos",
  });

  const handleRemoveOrgao = (index: number) => {
    const orgaoToRemove = fields[index];
    const currentPadraoId = methods.getValues("slugOrgaoPadrao");

    if (currentPadraoId === orgaoToRemove.slugOrgao) {
      methods.setValue("slugOrgaoPadrao", "");
    }

    remove(index);
  };

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

              {!isReadOnly && (
                <div className="flex w-full flex-col xl:max-w-182">
                  <InputSelectDropdownWrapper
                    name="orgaos"
                    control={control}
                    errors={errors}
                    label="Atribuir Órgão(s)*"
                    placeholder="Selecione um Órgão"
                    isReadOnly={isReadOnly}
                    queryValue={queryOrgao ?? ""}
                    options={orgaosDropdown ?? []}
                    defaultValue={"Selecione um Órgão"}
                    onQueryChange={(query) => setQueryOrgao?.(query)}
                    handleChange={(item: OrgaoDropdownType) => {
                      const { value, label } = item;

                      const orgaoAdicionado = fields.find(
                        (orgao) => orgao.slugOrgao === value,
                      );
                      if (!orgaoAdicionado) {
                        append({
                          slugOrgao: item.slug,
                          nomeOrgao: label,
                        });
                      }
                    }}
                  />
                </div>
              )}

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

          <section className="flex flex-col">
            <h1 className="border-t-1 border-t-gray-400 py-4 text-lg font-bold">
              Órgãos atribuídos ao Usuário
            </h1>

            <div className="pb-4">
              <TabelaOrgaosUsuario
                fields={fields}
                remove={handleRemoveOrgao}
                modo={modo}
                control={control}
                errors={errors}
                isReadOnly={isReadOnly}
              />
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
