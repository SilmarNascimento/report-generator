import { ChangeEvent } from "react";
import BarraPesquisa from "./BarraPesquisa";

type FiltroListagemProp = {
  searchTerm: string;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const FiltroListagem = ({
  searchTerm,
  handleSearchChange,
}: FiltroListagemProp) => {
  const placeholder = "Consulta";

  return (
    <div className="flex w-full flex-col gap-2 md:w-auto">
      <label className="text-foreground text-sm leading-4.5 font-bold md:mb-0">
        Pesquisar
        <BarraPesquisa
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
};

export default FiltroListagem;
