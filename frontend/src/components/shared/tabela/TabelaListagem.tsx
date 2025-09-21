import { TransformedFormTypes } from "@/types/general";
import LinhaTabelaListagem from "./LinhaTabelaListagem";
import { Acao } from "@/components/features/BotaoMenu";

type TabelaListagemProps<Type extends TransformedFormTypes> = {
  data: Type[];
  onSort?: (key: keyof Type) => void;
  tableHeaders: {
    key: keyof Type;
    label: string;
    labelTooltip?: string;
  }[];

  abrirModal: (
    id: number,
    nomeExibicao: string,
    status: string,
    tipo: "status" | "exclusao" | "publicacao",
  ) => void;

  getActions?: (item: Type) => Acao[];
};

type ConfigType = {
  tipo:
    | "usuarios"
    | "servicos-habilitados"
    | "perfis"
    | "motivos-bloqueio"
    | "agendas";
  nome: string;
  orgao?: string;
};

const TabelaListagem = <Type extends TransformedFormTypes>({
  data,
  onSort,
  tableHeaders,
  abrirModal,
  getActions,
}: TabelaListagemProps<Type>) => {
  const getConfig = (item: TransformedFormTypes): ConfigType => {
    if ("servico" in item && "orgao" in item) {
      return {
        tipo: "servicos-habilitados",
        nome: item.servico,
        orgao: item.orgao,
      };
    }

    if ("motivo" in item) {
      return {
        tipo: "motivos-bloqueio",
        nome: item.motivo,
      };
    }

    if ("nome" in item && "perfil" in item) {
      return {
        tipo: "usuarios",
        nome: item.nome,
      };
    }

    if ("perfil" in item) {
      return {
        tipo: "perfis",
        nome: item.perfil,
      };
    }

    if ("orgao" in item && "unidadeAtendimento" in item) {
      return {
        tipo: "agendas",
        nome: item.orgao,
      };
    }

    throw new Error("Tipo desconhecido de item em getConfig");
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] rounded-lg bg-[#FFFFFF] shadow-sm">
        <thead className="border-b border-[#DFDFDF] bg-[#FFFFFF]">
          <tr>
            {tableHeaders.map(({ key, label, labelTooltip }) => (
              <th
                key={String(key)}
                className="cursor-pointer px-4 py-3 text-sm font-bold"
                onClick={() => onSort?.(key)}
                title={labelTooltip}
              >
                <div className="flex items-center justify-between">
                  {label}
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#7F86A0" }}
                  >
                    expand_all
                  </span>
                </div>
              </th>
            ))}
            <th className="w-[100px] text-center text-sm font-bold">Ação</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => {
              const config = getConfig(item);

              return (
                <LinhaTabelaListagem
                  key={item.id}
                  item={item}
                  tableHeaders={tableHeaders}
                  tipo={config.tipo}
                  nome={config.nome}
                  contexto={config.tipo}
                  abrirModal={abrirModal}
                  getActions={getActions}
                />
              );
            })
          ) : (
            <tr>
              <td
                colSpan={tableHeaders.length + 1}
                className="bg-white px-4 py-3 text-center font-normal text-[#6C757D]"
              >
                <div className="mt-[36px] inline-block w-[475px] pb-2">
                  Nenhum registro encontrado
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaListagem;
