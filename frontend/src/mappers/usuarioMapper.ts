import {
  formularioUsuarioSchema,
  FormularioUsuarioType,
} from "@/components/forms/usuario/formularioUsuarioSchema";
import { DropdownType } from "@/types/general";
import {
  UsuarioFormularioComOpcoesPerfilType,
  UsuarioRequest,
  UsuarioResponse,
  UsuarioResumidoResponse,
  UsuarioTransformed,
} from "@/types/usuario";

export const mapUsuarioFormularioToRequest = (
  formData: FormularioUsuarioType,
): UsuarioRequest => {
  return {
    nome_usuario: formData.nomeUsuario,
    email: formData.emailUsuario,
    slug_orgaos: formData?.orgaos?.map((orgao) => orgao.slugOrgao) ?? [],
    slug_orgao_padrao: formData.slugOrgaoPadrao ?? "",
    id_perfil: Number(formData.perfilId),
  };
};

export const mapResponseToUsuarioFormulario = (
  data: UsuarioResponse,
): UsuarioFormularioComOpcoesPerfilType => {
  const usuarioForm = formularioUsuarioSchema.parse({
    nomeUsuario: data.nome_usuario,
    emailUsuario: data.email,
    perfilId: data.id_perfil ? data.id_perfil.toString() : "",
    slugOrgaoPadrao: data.slug_orgao_padrao ?? "",
    orgaos: data.orgaos.map((orgao) => ({
      nomeOrgao: orgao.nome_orgao,
      slugOrgao: orgao.slug_orgao,
    })),
  });

  const perfilOption: DropdownType = {
    label: data.nome_perfil,
    value: data.id_perfil ? data.id_perfil.toString() : "",
  };

  return {
    usuarioForm,
    perfilOption,
  };
};

export const mapUsuarioResumidoToUsuarioTransformed = (
  itens: UsuarioResumidoResponse[],
): UsuarioTransformed[] =>
  itens.map((item) => ({
    id: item.id_usuario,
    nome: item.nome_usuario,
    perfil: item.nome_perfil,
    status: item.status_usuario,
  }));
