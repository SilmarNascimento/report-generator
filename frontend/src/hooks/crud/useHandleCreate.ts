import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import apiService from "@/service/BackofficeApiService";
import { successAlert } from "@/util/toastAlerts";

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
  onConflict?: (mensagem: string, payload: DtoType) => void;
};

export function useHandleCreate<FormType, DtoType>({
  endpoint,
  invalidateKeys,
  successMessage,
  navigateTo,
  mapFn,
  searchParams,
  onConflict,
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
      navigate({
        to: navigateTo,
        search: searchParams ?? {
          pagina_atual: 1,
          registros_pagina: 25,
        },
      });
    },
    onError: (error, variables) => {
      if (error instanceof AxiosError && error.response?.status === 409) {
        const mensagem = error.response?.data?.mensagem;
        if (onConflict) {
          onConflict(mensagem, variables as DtoType);
          return;
        }
      }
      console.error(`Erro ao criar recurso:`, error);
    },
  });

  const handleCreate = async (formData: FormType) => {
    const payload = mapFn(formData);
    await mutation.mutateAsync(payload);
  };

  return { handleCreate };
}
