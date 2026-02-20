import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/ApiService";
import { createSearchParams, useNavigate } from "react-router-dom";
import { successAlert } from "@/utils/toastAlerts";

type SearchParamsType = {
  pagina_atual: number;
  registros_pagina: number;
};

type UseHandleCreateParams<FormType, DtoType> = {
  endpoint: string;
  invalidateKeys: string[][];
  successMessage: string;
  navigateTo: string;
  mapFn: (data: FormType) => DtoType;
  searchParams?: SearchParamsType;
};

export function useHandleCreate<FormType, DtoType>({
  endpoint,
  invalidateKeys,
  successMessage,
  navigateTo,
  mapFn,
  searchParams,
}: UseHandleCreateParams<FormType, DtoType>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: DtoType) => apiService.post(endpoint, data),
    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );

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
      console.error(`Erro ao criar recurso:`, error);
    },
  });

  const handleCreate = async (formData: FormType) => {
    try {
      const payload = mapFn(formData);
      await mutation.mutateAsync(payload);
    } catch (error) {
      console.error("Erro capturado no handleCreate:", error);
    }
  };

  return { handleCreate };
}
