import { DropdownType } from "@/types/general";
import { PerfilResponse } from "@/types/perfil";

export const mapPerfilsToDropdown = (data: PerfilResponse[]): DropdownType[] =>
  data.map(({ id_perfil, nome_perfil }) => ({
    label: nome_perfil,
    value: String(id_perfil),
  }));
