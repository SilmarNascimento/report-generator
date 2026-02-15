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
        <Botao perfil="cancelar" type="button" onClick={handleCancelar} />
      )}
      {modo === "view" && (
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
