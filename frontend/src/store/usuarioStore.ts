import { create } from "zustand";
import { createSelectors } from "./createSelectors";

export type OrgaoType = {
  orgaoId: number;
  nomeOrgao: string;
  slugOrgao: string;
  email: string;
  cnpj: string;
  sigla: string;
};

export type UsuarioStateType = {
  usuarioId: number | null;
  nomeUsuario: string | null;
  cpf: string | null;
  email: string | null;
  sid: string | null;
  statusUsuario: "ATIVO" | "INATIVO";
  perfil: {
    perfilId: number | null;
    nomePerfil: string | null;
    statusPerfil: string | null;
    permissoes: string[];
  };
  orgaos: OrgaoType[];
  orgaoPadraoId: string | null;

  carregandoPerfil: boolean;
  setUsuario: (usuario: Partial<UsuarioStateType>) => void;
  setCarregandoPerfil: (valor: boolean) => void;
};

export const useUsuarioStore = create<UsuarioStateType>((set) => ({
  usuarioId: null,
  nomeUsuario: null,
  cpf: null,
  email: null,
  sid: null,
  statusUsuario: "ATIVO",
  perfil: {
    perfilId: null,
    nomePerfil: null,
    statusPerfil: null,
    permissoes: [],
  },
  orgaos: [],
  orgaoPadraoId: "",

  carregandoPerfil: true,

  setUsuario: (usuario) =>
    set((state) => ({
      ...state,
      ...usuario,
      carregandoPerfil: false,
    })),

  setCarregandoPerfil: (valor) =>
    set((state) => ({ ...state, carregandoPerfil: valor })),
}));

export const useUsuarioStoreSelectors = createSelectors(useUsuarioStore);
