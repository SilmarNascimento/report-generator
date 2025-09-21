import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

type BotaoVoltarFormularioProps = {
  modo: "criacao" | "visualizacao" | "edicao";
  listagemEndpoint: string;
  id?: string;
};

export function BotaoVoltarFormulario({
  modo,
  listagemEndpoint,
  id,
}: BotaoVoltarFormularioProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (modo === "criacao" || modo === "visualizacao") {
      navigate({ to: listagemEndpoint });
    }
    if (modo === "edicao" && id) {
      navigate({ to: `${listagemEndpoint}/visualizar-configuracao/${id}` });
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      <ArrowLeft size={20} />
    </button>
  );
}
