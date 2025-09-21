import { UsuarioResponse } from "./usuario";

export type PerfilRequest = {
  nome_perfil: string;
  permissoes: string[];
};

export type PerfilResponse = {
  id_perfil: number;
  nome_perfil: string;
  permissoes: string[];
  status_perfil: string;
  usuarios: UsuarioResponse[];
};

export type PerfilResumidoResponse = {
  id_perfil: number;
  nome_perfil: string;
  status_perfil: string;
};

export type PerfilResponseMapeado = {
  formData: FormularioPerfilType;
  listaUsuarios: UsuarioResponse[];
};

export type AlterarStatusPerfilRequest = {
  status_perfil: string;
};

export type ListaAutorizacaoType = {
  titulo: string;
  opcoes: string[];
}[];

export type PerfilTransformed = {
  id: number;
  perfil: string;
  status: string;
};

// export type ProfileData = {
//   id: number;
//   perfil: string;
//   status: string;
// };

// export type ListarPerfisResponse = {
//   total: number;
//   pagina_atual: number;
//   registros_pagina: number;
//   perfis: PerfilResponse[];
// }
