import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/BackofficeApiService";
import { successAlert } from "@/util/toastAlerts";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";

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
  onConflict?: (mensagem: string, payload: DtoType) => void;
};

export function useHandleEdit<FormType, DtoType>({
  id,
  endpoint,
  invalidateKeys,
  successMessage,
  navigateTo,
  mapFn,
  searchParams,
  onConflict,
}: UseHandleEditParams<FormType, DtoType>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: DtoType) => apiService.put(`${endpoint}/${id}`, data),
    onSuccess: () => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      successAlert(successMessage);
      navigate({
        to: navigateTo,
        search: searchParams ?? {
          pagina_atual: 1,
          registros_pagina: endpoint.includes("/agendas") ? 5 : 25,
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
      console.error(`Erro ao editar recurso:`, error);
    },
  });

  const handleEdit = async (formData: FormType) => {
    const payload = mapFn(formData);
    await mutation.mutateAsync(payload);
  };

  return { handleEdit };
}
