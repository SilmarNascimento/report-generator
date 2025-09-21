export const PERFIL_LIST_QUERY_KEY = ["/perfil"];
export const PERFIL_QUERY_KEY = (id: string) => ["/perfil", id];

export const perfilCabecalhoTabela = [
  {
    key: "perfil",
    label: "Perfil",
  },
  {
    key: "status",
    label: "Status",
  },
] as const;

export const perfilFieldMapping = {
  id: "idPerfil",
  perfil: "nomePerfil",
  status: "statusPerfil",
};

export const reverseFieldMapping = {
  idPerfil: "id",
  nomePerfil: "perfil",
  statusPerfil: "status",
};
