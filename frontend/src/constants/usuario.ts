export const USUARIO_QUERY_KEY = (id: string) => ["/usuario", id];

export const usuarioFieldMapping = {
  nome: "nomeUsuario",
  perfil: "perfil.nomePerfil",
  status: "statusUsuario",
};
export const usuarioCabecalhoTabela = [
  { key: "nome", label: "Nome" },
  { key: "perfil", label: "Perfil" },
  { key: "status", label: "Status" },
] as const;
