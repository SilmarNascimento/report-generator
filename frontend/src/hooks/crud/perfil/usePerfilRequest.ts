import { useGetResourceByIdRequest } from "@/hooks/crud/useGetResourseByIdRequest";
import { PerfilResponse } from "@/types/perfil";

export const usePerfilRequest = (id: string) =>
  useGetResourceByIdRequest<PerfilResponse>("/perfil", id);
