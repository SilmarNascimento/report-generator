import { useNavigate } from "react-router-dom";
import Botao from "./Botao";

type SessaoBotoesFormularioProp = {
  modo: "view" | "edicao" | "criacao";
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
      {modo !== "view" && (
        <Botao
          variant="cancelar"
          label="Cancelar"
          type="button"
          onClick={handleCancelar}
        />
      )}
      {modo === "view" && (
        <Botao
          variant="voltar"
          label="voltar"
          type="button"
          onClick={() => navigate(`${listagemEndpoint}`)}
        />
      )}
      {modo === "edicao" && (
        <Botao
          variant="confirmar"
          label="Confirmar"
          type="submit"
          disabled={!isDirty}
        />
      )}
      {modo === "criacao" && (
        <Botao variant="confirmar" label="Confirmar" type="submit" />
      )}
    </section>
  );
};

export default SessaoBotoesFormulario;
