import {
  FormularioPerfilType,
  SessaoPerfilType,
} from "@/components/forms/perfil/formularioPerfilSchema";
import { permissoes } from "@/constants/general";
import {
  PerfilRequest,
  PerfilResponse,
  PerfilResponseMapeado,
  PerfilResumidoResponse,
} from "@/types/perfil";

const mapLabelToValue = new Map(
  permissoes.map((permissao) => [permissao.label, permissao.value]),
);

const mapearPermissoesPorSessao = (
  permissoesDoBackend: string[],
): SessaoPerfilType[] => {
  const permissoesMarcadas = new Set(permissoesDoBackend);

  const permissoesAgrupadas = permissoes.reduce((acc, p) => {
    const jaExisteSessao = acc.find((a) => a.tituloSessao === p.modulo);
    const opcao = {
      name: p.label,
      checked: permissoesMarcadas.has(p.value),
    };

    if (jaExisteSessao) {
      jaExisteSessao.opcoesPermissao.push(opcao);
    } else {
      acc.push({
        tituloSessao: p.modulo,
        opcoesPermissao: [opcao],
      });
    }

    return acc;
  }, [] as SessaoPerfilType[]);

  return permissoesAgrupadas;
};

export const mapPerfilFormularioToRequest = (
  data: FormularioPerfilType,
): PerfilRequest => {
  return {
    nome_perfil: data.nomePerfil,
    permissoes: data.permissoes.flatMap((section) =>
      section.opcoesPermissao
        .filter((opcao) => opcao.checked)
        .map((opcao) => mapLabelToValue.get(opcao.name) ?? ""),
    ),
  };
};

export const mapPerfilResponseToFormulario = (
  perfilResponse: PerfilResponse,
): PerfilResponseMapeado => {
  const formData: FormularioPerfilType = {
    nomePerfil: perfilResponse.nome_perfil,
    permissoes: mapearPermissoesPorSessao(perfilResponse.permissoes),
  };
  const listaUsuarios = perfilResponse.usuarios;

  return {
    formData,
    listaUsuarios,
  };
};

export const mapPerfilResumidoToPerfilTransformed = (
  dados: PerfilResumidoResponse[],
) => {
  return dados.map((perfil) => ({
    id: perfil.id_perfil,
    perfil: perfil.nome_perfil,
    status: perfil.status_perfil,
  }));
};
