import { Control, FieldArrayWithId, FieldErrors } from "react-hook-form";
import Botao from "@/components/shared/Botao";
import { FormularioUsuarioType } from "@/components/forms/usuario/formularioUsuarioSchema";
import { obterValorAninhadoComArray } from "@/util/errorParser";
import { InputRadioWrapper } from "@/components/features/formularioInput/InputRadioWrapper";

interface TabelaOrgaosUsuarioProps {
  fields: FieldArrayWithId<FormularioUsuarioType, "orgaos", "id">[];
  remove: (index: number) => void;
  modo: "edicao" | "visualizacao";
  errors?: FieldErrors<FormularioUsuarioType>;
  control: Control<FormularioUsuarioType>;
  isReadOnly: boolean;
}

const TabelaOrgaosUsuario = ({
  fields,
  remove,
  modo,
  control,
  errors,
  isReadOnly,
}: TabelaOrgaosUsuarioProps) => {
  const fieldError = obterValorAninhadoComArray(errors, "orgaoPadraoId");
  const hasError = !!fieldError;
  const errorMessage = hasError
    ? String(fieldError?.["orgaoPadraoId"].message)
    : "";

  if (fields.length === 0) {
    return <p className="px-4">Nenhum órgão vinculado ao usuário</p>;
  }

  return (
    <>
      <p className="mx-4 my-6 text-sm font-bold">Órgão Padrão</p>
      <div className="flex flex-col overflow-hidden rounded-xl">
        {fields.map((orgao, index) => (
          <div
            key={orgao.id}
            className={`flex h-12 flex-row items-center justify-between px-4.5 ${
              index % 2 === 0 ? "bg-[#F3F4F5]" : "bg-[#E7E9EB]"
            }`}
          >
            <div className="flex flex-row">
              <div className="flex h-12 w-20 items-center justify-center">
                <InputRadioWrapper
                  name="slugOrgaoPadrao"
                  value={orgao.slugOrgao}
                  control={control}
                  isReadOnly={isReadOnly}
                />
              </div>
              <p className="flex items-center px-4 text-base font-normal">
                {orgao.nomeOrgao}
              </p>
            </div>
            <div>
              {modo === "edicao" && (
                <Botao perfil="removerSessao" onClick={() => remove(index)} />
              )}
            </div>
          </div>
        ))}
      </div>
      <p
        className={`mt-1 text-sm ${
          hasError ? "text-red-400" : "text-transparent"
        }`}
      >
        {errorMessage || "\u00A0"}
      </p>
    </>
  );
};

export default TabelaOrgaosUsuario;
