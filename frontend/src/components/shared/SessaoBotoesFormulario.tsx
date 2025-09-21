import { useNavigate } from "@tanstack/react-router";
import Botao from "./Botao";

type SessaoBotoesFormularioProp = {
  modo: "visualizacao" | "edicao" | "criacao";
  listagemEndpoint: string;
  isDirty?: boolean;
};

const SessaoBotoesFormulario = ({
  modo,
  listagemEndpoint,
  isDirty,
}: SessaoBotoesFormularioProp) => {
  const navigate = useNavigate();

  return (
    <section className={`mt-auto flex justify-end gap-6`}>
      {modo !== "visualizacao" && (
        <Botao
          perfil="cancelar"
          onClick={() => navigate({ to: `${listagemEndpoint}` })}
        />
      )}
      {modo === "visualizacao" && (
        <Botao
          perfil="voltar"
          onClick={() => navigate({ to: `${listagemEndpoint}` })}
        />
      )}
      {modo === "edicao" && (
        <Botao perfil="alterar" type="submit" disabled={!isDirty} />
      )}
      {modo === "criacao" && <Botao perfil="salvar" type="submit" />}
    </section>
  );
};

export default SessaoBotoesFormulario;
