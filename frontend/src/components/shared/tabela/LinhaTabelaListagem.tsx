import BotaoMenu, { Acao } from "@/components/features/BotaoMenu";
import useActions from "@/hooks/useActions";
import { TransformedFormTypes } from "@/types/general";
import StatusBadge from "../../ui/StatusBadge";

type LinhaTabelaListagemProps<Type> = {
  item: Type;
  tableHeaders: { key: keyof Type; label: string }[];
  tipo:
    | "usuarios"
    | "servicos-habilitados"
    | "perfis"
    | "motivos-bloqueio"
    | "agendas";
  nome: string;
  contexto:
    | "servicos-habilitados"
    | "motivos-bloqueio"
    | "usuarios"
    | "perfis"
    | "agendas";
  abrirModal: (
    id: number,
    nomeExibicao: string,
    status: string,
    tipo: "status" | "exclusao" | "publicacao",
    orgao?: string,
  ) => void;
  getActions?: (item: Type) => Acao[];
};

const LinhaTabelaListagem = <Type extends TransformedFormTypes>({
  item,
  tableHeaders,
  tipo,
  nome,
  contexto,
  abrirModal,
  getActions,
}: LinhaTabelaListagemProps<Type>) => {
  const renderTableLine = (key: keyof Type) => {
    if (key === "status") {
      return <StatusBadge status={item[key] as string} />;
    }

    const value = item[key];
    return value !== null && value !== undefined ? String(value) : "-";
  };

  const hookActions = useActions(
    {
      id: item.id,
      tipo,
      nome,
      status: "status" in item ? item.status : "",
    },
    abrirModal,
    contexto,
  );

  const acoes = getActions ? getActions(item) : hookActions;

  return (
    <tr className="border-b border-[#DFDFDF] bg-[#FFFFFF] hover:bg-gray-200">
      {tableHeaders
        .filter(({ key }) => key !== "id")
        .map(({ key }) => (
          <td
            key={String(key)}
            className={`min-w-[100px] px-4 py-3 break-words`}
          >
            {renderTableLine(key)}
          </td>
        ))}

      <td className="flex items-center justify-center gap-3 px-4 py-3">
        <BotaoMenu acoes={acoes} variant="default" />
      </td>
    </tr>
  );
};

export default LinhaTabelaListagem;
