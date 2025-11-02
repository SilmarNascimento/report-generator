import { PERFIL_LIST_QUERY_KEY, PERFIL_QUERY_KEY } from "@/constants/perfil";
import apiService from "@/service/BackofficeApiService";
import { ListaPaginada } from "@/types/general";
import { PerfilResponse } from "@/types/perfil";
import { queryOptions } from "@tanstack/react-query";

const fetchPerfilList = async (): Promise<PerfilResponse[]> => {
  const response = await apiService.get<ListaPaginada<PerfilResponse>>(
    "/perfil",
    {
      pagina_atual: 0,
      registros_pagina: 50,
    },
  );
  return response.dados;
};

const fetchPerfil = async (id: string): Promise<PerfilResponse> => {
  return apiService.get<PerfilResponse>(`/perfil/${id}`);
};

export const perfilListQueryOptions = queryOptions({
  queryKey: PERFIL_LIST_QUERY_KEY,
  queryFn: fetchPerfilList,
});

export const perfilQueryOptions = (id: string) =>
  queryOptions({
    queryKey: PERFIL_QUERY_KEY(id),
    queryFn: () => fetchPerfil(id),
  });

export const perfilLoader = async ({ params, context }) => {
  const { id } = params;
  if (!id) throw new Error("ID do perfil é obrigatório.");

  const perfil = await context.queryClient.ensureQueryData(
    perfilQueryOptions(id),
  );

  return { perfil };
};
