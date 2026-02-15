import { useNavigate } from "react-router-dom";
import Botao from "./Botao";

type SessaoBotoesFormularioProp = {
  modo: "visualizacao" | "edicao" | "criacao";
  listagemEndpoint: string;
  isDirty?: boolean;
  onCancelar?: () => void;
};

const SessaoBotoesFormulario = ({
  modo,
  listagemEndpoint,
  isDirty,
  onCancelar,
}: SessaoBotoesFormularioProp) => {
  const navigate = useNavigate();

  const handleCancelar = () => {
    if (onCancelar) {
      onCancelar();
      return;
    }

    navigate(`${listagemEndpoint}`);
  };

  return (
    <section className={`mt-auto flex justify-end gap-6`}>
      {modo !== "visualizacao" && (
        <Botao perfil="cancelar" type="button" onClick={handleCancelar} />
      )}
      {modo === "visualizacao" && (
        <Botao
          perfil="voltar"
          onClick={() => navigate(`${listagemEndpoint}`)}
        />
      )}
      {modo === "edicao" && (
        <Botao perfil="salvar" type="submit" disabled={!isDirty} />
      )}
      {modo === "criacao" && <Botao perfil="salvar" type="submit" />}
    </section>
  );
};

export default SessaoBotoesFormulario;
