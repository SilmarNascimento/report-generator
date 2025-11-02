import { ChangeEvent, useMemo } from "react";
import useDebounceValue from "./useDebounceValue";
import { useQuery } from "@tanstack/react-query";
import apiService from "../service/BackofficeApiService";
import { Paginacao } from "../types/general";

type ApiResponse<T> = {
  dados: T[];
  paginacao: Paginacao;
};

type SearchControl = {
  searchParams: Record<string, unknown>;
  setSearchParams: (params: Record<string, unknown>) => void;
};

function useStableArray<T>(value: unknown): T[] {
  return useMemo(() => {
    return Array.isArray(value) ? (value as T[]) : [];
  }, [value]);
}

const useListagemDados = <Type, MappedType>(
  endpoint: string,
  searchField: string,
  fieldMapping: Record<string, string>,
  transformData: (items: Type[]) => MappedType[],
  defaultSortField: string,
  searchControl?: SearchControl,
) => {
  const searchParams = searchControl?.searchParams ?? {};
  const setSearchParams = searchControl?.setSearchParams ?? (() => {});

  const page = Number(searchParams["pagina_atual"] ?? 1);
  const pageSize = Number(searchParams["registros_pagina"] ?? 25);
  const searchTerm = String(searchParams[searchField] ?? "");
  const orgaosId = useStableArray<string>(searchParams["orgaosId"]);
  const unidadesAtendimentoId = useStableArray<string>(
    searchParams["unidadesAtendimentoId"],
  );
  const servicosHabilitadosId = useStableArray<string>(
    searchParams["servicosHabilitadosId"],
  );
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const ordenacao = String(
    searchParams["ordenacao"] ?? `${defaultSortField},asc`,
  );
  const [backendSortField, backendSortDirection = "asc"] = ordenacao.split(",");

  const queryKey = useMemo(
    () => [
      endpoint,
      page,
      pageSize,
      ordenacao,
      debouncedSearchTerm,
      orgaosId,
      unidadesAtendimentoId,
      servicosHabilitadosId,
    ],
    [
      endpoint,
      page,
      pageSize,
      ordenacao,
      debouncedSearchTerm,
      orgaosId,
      unidadesAtendimentoId,
      servicosHabilitadosId,
    ],
  );

  const {
    data,
    isFetching: loading,
    error,
    refetch,
  } = useQuery<{ transformed: MappedType[]; pagination: Paginacao }>({
    queryKey,
    queryFn: async () => {
      const requestParams: Record<string, unknown> = {
        pagina_atual: page - 1,
        registros_pagina: pageSize,
        ordenacao,
        [searchField]: debouncedSearchTerm,
      };

      if (searchParams["orgaosId"]) {
        requestParams["idsOrgaos"] = (
          searchParams["orgaosId"] as string[]
        ).join(",");
      }
      if (searchParams["unidadesAtendimentoId"]) {
        requestParams["idsUnidades"] = (
          searchParams["unidadesAtendimentoId"] as string[]
        ).join(",");
      }
      if (searchParams["servicosHabilitadosId"]) {
        requestParams["idsServicos"] = (
          searchParams["servicosHabilitadosId"] as string[]
        ).join(",");
      }

      const { dados, paginacao } = await apiService.get<ApiResponse<Type>>(
        endpoint,
        requestParams,
      );

      return {
        transformed: transformData(dados),
        pagination: paginacao,
      };
    },
    placeholderData: (previousData) => previousData,
  });

  const atualizarDados = () => {
    refetch();
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;

    setSearchParams({
      ...searchParams,
      [searchField]: newSearchTerm,
      pagina_atual: 1,
    });
  };

  const sortTable = (key: string) => {
    const backendField = fieldMapping[key];
    if (!backendField) return;

    const newDirection =
      backendField === backendSortField && backendSortDirection === "asc"
        ? "desc"
        : "asc";

    setSearchParams({
      ...searchParams,
      ordenacao: `${backendField},${newDirection}`,
      pagina_atual: 1,
    });
  };

  return {
    data,
    page,
    totalPages: data?.pagination?.total_paginas ?? 0,
    totalItems: data?.pagination?.total_registros ?? 0,
    searchTerm,
    loading,
    error,
    handleSearchChange,
    sortTable,
    atualizarDados,
  };
};

export default useListagemDados;
