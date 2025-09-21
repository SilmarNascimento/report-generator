import { Permissao } from "@/constants/profiles";
import { Paginacao } from "./general";

export type UserData = {
  id: number;
  nome: string;
  perfil: string;
  orgaos: string;
  status: string;
};

export type FormularioUsuarioResponse = {
  id_usuario: number;
  nome_usuario: string;
  nome_perfil: string;
  status_usuario: string;
  nome_orgao: string;
}

export type ApiUserResponse = {
  dados: FormularioUsuarioResponse[];
  paginacao: Paginacao;
}

type OrgaoResponseType = {
  id_orgao: number;
  nome_orgao: string;
  email: string;
  cnpj: string;
  sigla: string;
}

export type UsuarioPorCpfType = {
  id_usuario: number;
  nome_usuario: string;
  cpf: string;
  email: string;
  sid: string;
  status_usuario: "ATIVO" | "INATIVO";
  perfil: {
    id_perfil: number;
    nome_perfil: string;
    status_perfil: string;
    permissoes: Permissao[];
  };
  orgaos: OrgaoResponseType[];
  id_orgao_padrao: number;
}

export type SortDirection = 'asc' | 'desc';