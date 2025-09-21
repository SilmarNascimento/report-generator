import { FormularioUsuarioType } from "@/components/forms/usuario/formularioUsuarioSchema";
import { mapUsuarioFormularioToRequest } from "@/mappers/usuarioMapper";
import { useHandleEdit } from "@/hooks/crud/useHandleEdit";
import { UsuarioRequest } from "@/types/usuario";
import { USUARIO_QUERY_KEY } from "@/constants/usuario";

export function useHandleEditUsuario(id: string) {
  return useHandleEdit<FormularioUsuarioType, UsuarioRequest>({
    id,
    endpoint: "/usuario",
    invalidateKeys: [USUARIO_QUERY_KEY(id)],
    successMessage: "Usuário alterado com sucesso!",
    navigateTo: "/usuarios",
    mapFn: mapUsuarioFormularioToRequest,
  });
}
