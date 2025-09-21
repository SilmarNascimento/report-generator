import { useNavigate } from "@tanstack/react-router";
import Botao from "./Botao";
import { ConfiguracaoAgendaRequest } from "@/types/configuracaoAgenda";

type SessaoBotoesFormularioProp = {
  modo: "visualizacao" | "edicao" | "criacao";
  listagemEndpoint: string;
  id?: string;
  isDirty?: boolean;
  abrirModal?: (data?: ConfiguracaoAgendaRequest) => void;
};

const SessaoBotoesConfiguracaoAgenda = ({
  modo,
  listagemEndpoint,
  id,
  isDirty,
  abrirModal,
}: SessaoBotoesFormularioProp) => {
  const navigate = useNavigate();

  const editEndpoint = `${listagemEndpoint}/editar-configuracao/${id}`;
  const visualizacaoEndpoint = `${listagemEndpoint}/visualizar-configuracao/${id}`;

  return (
    <section className="mt-auto flex justify-end gap-6">
      {modo === "criacao" && (
        <div className="flex flex-row gap-6">
          <Botao
            perfil="cancelar"
            onClick={() => navigate({ to: `${listagemEndpoint}` })}
          />
          <Botao perfil="salvar" type="submit" />
        </div>
      )}

      {modo === "visualizacao" && (
        <div className="flex flex-row gap-6">
          <Botao perfil="excluir" onClick={() => abrirModal && abrirModal()} />
          <Botao
            perfil="editar configuracoes"
            onClick={() => navigate({ to: `${editEndpoint}` })}
          />
        </div>
      )}

      {modo === "edicao" && (
        <div className="flex flex-row gap-6">
          <Botao
            perfil="cancelar"
            onClick={() => navigate({ to: `${visualizacaoEndpoint}` })}
          />
          <Botao perfil="salvar" type="submit" disabled={!isDirty} />
        </div>
      )}
    </section>
  );
};

export default SessaoBotoesConfiguracaoAgenda;
