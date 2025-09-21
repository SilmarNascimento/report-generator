import { useGetResourceByIdRequest } from "@/hooks/crud/useGetResourseByIdRequest";
import { UsuarioResponse } from "@/types/usuario";

export const useUsuarioRequest = (id: string) =>
  useGetResourceByIdRequest<UsuarioResponse>("/usuario", id);
