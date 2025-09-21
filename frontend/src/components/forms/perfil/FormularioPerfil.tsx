import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  formularioPerfilSchema,
  FormularioPerfilType,
} from "./formularioPerfilSchema";
import { InputTextWrapper } from "@/components/features/formularioInput/InputTextWrapper";
import { InputCheckboxWrapper } from "@/components/features/formularioInput/InputCheckboxWrapper";
import SessaoBotoesFormulario from "@/components/shared/SessaoBotoesFormulario";
import { useMemo } from "react";
import { UsuarioResponse } from "@/types/usuario";
import { listaAutorizacao } from "@/constants/general";

export type FormularioPerfilProps = {
  titulo: string;
  modo: "criacao" | "edicao" | "visualizacao";
  handleSubmitRequest?: (data: FormularioPerfilType) => Promise<void>;
  defaultValues?: FormularioPerfilType;
  listaUsuarios?: UsuarioResponse[];
};

const FormularioPerfil = ({
  titulo,
  modo,
  defaultValues,
  handleSubmitRequest,
  listaUsuarios,
}: FormularioPerfilProps) => {
  const isReadOnly = modo === "visualizacao";

  const memoizedDefaultValues = useMemo(() => {
    return defaultValues
      ? formularioPerfilSchema.parse(defaultValues)
      : {
          nomePerfil: "",
          permissoes: listaAutorizacao.map((section) => ({
            tituloSessao: section.titulo,
            opcoesPermissao: section.opcoes.map((option) => ({
              name: option,
              checked: false,
            })),
          })),
        };
  }, [defaultValues]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormularioPerfilType>({
    resolver: zodResolver(formularioPerfilSchema),
    defaultValues: memoizedDefaultValues,
  });

  return (
    <form
      onSubmit={
        handleSubmitRequest
          ? handleSubmit(handleSubmitRequest)
          : (event) => event.preventDefault()
      }
      className="flex min-h-[calc(100vh-360px)] flex-col justify-between gap-[22px] rounded-2xl bg-[#FFFFFF] px-6 py-8"
    >
      <section className="flex flex-col gap-6">
        <section className="flex flex-col">
          <div>
            <h1 className={`mb-4 text-lg font-bold`}>{titulo}</h1>
          </div>

          {modo !== "visualizacao" && (
            <div className="flex w-100 flex-col">
              <InputTextWrapper
                name={`nomePerfil`}
                control={control}
                errors={errors}
                label="Nome do Perfil*"
                placeholder="Digite o nome do novo Perfil"
                isReadOnly={isReadOnly}
              />
            </div>
          )}
        </section>

        <section className="flex flex-col">
          <div>
            <h1 className={`mb-4 text-lg font-bold`}>Funcionalidades</h1>
          </div>

          <div className="overflow-hidden rounded-xl">
            {listaAutorizacao.map((section, sectionIndex) => (
              <div
                key={section.titulo}
                className={`flex min-h-[56px] items-center px-4 py-2 sm:h-auto md:h-auto ${
                  sectionIndex % 2 === 0 ? "bg-[#F3F4F5]" : "bg-[#E7E9EB]"
                }`}
              >
                <h2 className="w-[160px] flex-shrink-0 font-bold text-[#2C2E34]">
                  {section.titulo}
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-5">
                  {section.opcoes.map((option, optionIndex) => (
                    <InputCheckboxWrapper
                      key={`${sectionIndex}-${optionIndex}`}
                      name={`permissoes.${sectionIndex}.opcoesPermissao.${optionIndex}.checked`}
                      control={control}
                      label={option}
                      isReadOnly={isReadOnly}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {isReadOnly && (
          <section className="flex flex-col">
            <h1 className="border-t-1 border-t-gray-400 py-4 text-lg font-bold">
              Usuários Vinculados ao Perfil
            </h1>

            <div className="pb-4">
              {listaUsuarios && listaUsuarios?.length >= 1 ? (
                <div className="overflow-hidden rounded-xl">
                  {listaUsuarios.map((usuario, usuarioIndex) => (
                    <p
                      key={usuario.id_usuario}
                      className={`flex h-6 items-center px-4 py-1 font-normal ${
                        usuarioIndex % 2 === 0 ? "bg-[#F3F4F5]" : "bg-[#E7E9EB]"
                      }`}
                    >
                      {usuario.nome_usuario}
                    </p>
                  ))}
                </div>
              ) : (
                <p>Nenhum usuário vinculado ao perfil</p>
              )}
            </div>
          </section>
        )}
      </section>

      <SessaoBotoesFormulario
        modo={modo}
        listagemEndpoint="/perfis"
        isDirty={isDirty}
      />
    </form>
  );
};

export default FormularioPerfil;
