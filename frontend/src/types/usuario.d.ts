import { FormularioUsuarioType } from "@/components/forms/usuario/formularioUsuarioSchema";
import { DropdownType } from "./general";
import { OrgaoResponse } from "./orgao";

export type UsuarioRequest = {
  nome_usuario: string;
  email: string;
  id_perfil: number;
  slug_orgaos: string[];
  slug_orgao_padrao: string;
};

export type UsuarioResponse = {
  id_usuario: number;
  nome_usuario: string;
  cpf: string;
  email: string;
  sid: string;
  status_usuario: string;
  ativo: boolean;
  id_perfil: number;
  nome_perfil: string;
  slug_orgao_padrao: string;
  orgaos: OrgaoResponse[];
};

export type UsuarioResumidoResponse = {
  id_usuario: number;
  nome_usuario: string;
  nome_perfil: string;
  status_usuario: string;
};

export interface UsuarioTransformed {
  id: number;
  nome: string;
  perfil: string;
  status: string;
}

export type UsuarioFormularioComOpcoesPerfilType = {
  usuarioForm: FormularioUsuarioType;
  perfilOption: DropdownType;
};

export interface AlterarStatusUsuarioRequest {
  status_usuario: string;
}
