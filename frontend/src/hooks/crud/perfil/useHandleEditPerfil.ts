import { FormularioPerfilType } from "@/components/forms/perfil/formularioPerfilSchema";
import { useHandleEdit } from "@/hooks/crud/useHandleEdit";
import { PerfilRequest } from "@/types/perfil";
import { PERFIL_QUERY_KEY } from "@/constants/perfil";
import { mapPerfilFormularioToRequest } from "@/mappers/perfilMapper";

export function useHandleEditPerfil(id: string) {
  return useHandleEdit<FormularioPerfilType, PerfilRequest>({
    id,
    endpoint: "/perfil",
    invalidateKeys: [PERFIL_QUERY_KEY(id)],
    successMessage: "Perfil alterado com sucesso!",
    navigateTo: "/perfis",
    mapFn: mapPerfilFormularioToRequest,
  });
}
