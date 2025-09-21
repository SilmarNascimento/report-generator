import { FormularioPerfilType } from "@/components/forms/perfil/formularioPerfilSchema";
import { mapPerfilFormularioToRequest } from "@/mappers/perfilMapper";
import { useHandleCreate } from "@/hooks/crud/useHandleCreate";
import { PerfilRequest } from "@/types/perfil";

export function useHandleCreatePerfil() {
  return useHandleCreate<FormularioPerfilType, PerfilRequest>({
    endpoint: "/perfil",
    invalidateKeys: [["/perfil"]],
    successMessage: "Perfil cadastrado com sucesso!",
    navigateTo: "/perfis",
    mapFn: mapPerfilFormularioToRequest,
  });
}
