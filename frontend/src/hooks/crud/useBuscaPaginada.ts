import { Paginacao } from "@/types/general";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/service/BackofficeApiService";

type ApiResponse<T> = {
  dados: T[];
  paginacao: Paginacao;
};

type UseBuscaPaginadaProps = {
  endpoint: string;
  searchField: string;
  searchTerm: string;
  page?: number;
  pageSize?: number;
  extraParams?: Record<string, unknown>;
};

export function useBuscaPaginada<T>({
  endpoint,
  searchField,
  searchTerm,
  page = 1,
  pageSize = 25,
  extraParams = {},
}: UseBuscaPaginadaProps) {
  const {
    data,
    isFetching: loading,
    error,
    refetch,
  } = useQuery<ApiResponse<T>>({
    queryKey: [endpoint, searchField, searchTerm, page, pageSize, extraParams],
    queryFn: async () => {
      const params: Record<string, unknown> = {
        pagina_atual: page - 1,
        registros_pagina: pageSize,
        [searchField]: searchTerm,
        ...extraParams,
      };

      return apiService.get<ApiResponse<T>>(endpoint, params);
    },
    placeholderData: (prev) => prev,
  });

  return {
    data: data?.dados ?? [],
    pagination: data?.paginacao,
    totalPages: data?.paginacao?.total_paginas ?? 0,
    totalItems: data?.paginacao?.total_registros ?? 0,
    loading,
    error,
    refetch,
  };
}
