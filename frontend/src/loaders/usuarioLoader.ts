import apiService from "@/service/BackofficeApiService";
import { ListaPaginada } from "@/types/general";
import { OrgaoResponse } from "@/types/orgao";
import { queryOptions } from "@tanstack/react-query";
import { UsuarioResponse } from "@/types/usuario";
import { ORGAOS_QUERY_KEY } from "@/constants/orgao";
import { USUARIO_QUERY_KEY } from "@/constants/usuario";
import { perfilListQueryOptions } from "./perfilLoader";

const fetchOrgaos = async (): Promise<OrgaoResponse[]> => {
  const response = await apiService.get<ListaPaginada<OrgaoResponse>>(
    "/orgao",
    {
      pagina_atual: 0,
      registros_pagina: 50,
    },
  );
  return response.dados;
};

const fetchUsuarios = async (id: string): Promise<UsuarioResponse> => {
  return apiService.get<UsuarioResponse>(`/usuario/${id}`);
};

export const orgaosQueryOptions = queryOptions({
  queryKey: ORGAOS_QUERY_KEY,
  queryFn: fetchOrgaos,
});

export const usuarioQueryOptions = (id: string) =>
  queryOptions({
    queryKey: USUARIO_QUERY_KEY(id),
    queryFn: () => fetchUsuarios(id),
  });

export const editarUsuarioLoader = async ({ params, context }) => {
  const { id } = params;
  if (!id) throw new Error("ID do perfil é obrigatório.");
  const queryClient = context.queryClient;

  const [servicoHabilitado, orgaos, perfis] = await Promise.all([
    queryClient.ensureQueryData(usuarioQueryOptions(id)),
    queryClient.ensureQueryData(orgaosQueryOptions),
    queryClient.ensureQueryData(perfilListQueryOptions),
  ]);

  return {
    servicoHabilitado,
    orgaos,
    perfis,
  };
};

export const visualizacaoUsuarioLoader = async ({ params, context }) => {
  const { id } = params;
  if (!id) throw new Error("ID do usuário é obrigatório.");

  const servicoHabilitado = await context.queryClient.ensureQueryData(
    usuarioQueryOptions(id),
  );

  return { servicoHabilitado };
};
