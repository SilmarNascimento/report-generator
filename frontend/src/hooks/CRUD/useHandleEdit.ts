import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { successAlert } from "@/utils/toastAlerts";
import { createSearchParams, useNavigate } from "react-router-dom";

type SearchParamsType = {
  pagina_atual: number;
  registros_pagina: number;
};

type UseHandleEditParams<FormType, DtoType> = {
  id: string;
  endpoint: string;
  invalidateKeys: string[][];
  successMessage: string;
  navigateTo: string;
  mapFn: (data: FormType) => DtoType;
  searchParams?: SearchParamsType;
};

export function useHandleEdit<FormType, DtoType>({
  id,
  endpoint,
  invalidateKeys,
  successMessage,
  navigateTo,
  mapFn,
  searchParams,
}: UseHandleEditParams<FormType, DtoType>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: DtoType) => apiService.put(`${endpoint}/${id}`, data),
    onSuccess: async () => {
      await Promise.all([
        ...invalidateKeys.map((key) =>
          queryClient.invalidateQueries({ queryKey: key }),
        ),
      ]);
      successAlert(successMessage);

      const params = {
        pagina_atual: String(searchParams?.pagina_atual ?? 1),
        registros_pagina: String(searchParams?.registros_pagina ?? 25),
      };

      navigate({
        pathname: navigateTo,
        search: `?${createSearchParams(params)}`,
      });
    },
    onError: (error) => {
      console.error(`Erro ao editar recurso:`, error);
    },
  });

  const handleEdit = async (formData: FormType) => {
    const payload = mapFn(formData);
    await mutation.mutateAsync(payload);
  };

  return { handleEdit };
}
