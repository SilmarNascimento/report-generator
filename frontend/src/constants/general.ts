import { ListaAutorizacaoType } from "@/types/perfil";

export enum Status {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
}

export const permissoes = [
  {
    modulo: "Serviços Habilitados",
    label: "Listar Serviços Habilitados",
    value: "LISTAR_SERVICO_HABILITADO",
  },
  {
    modulo: "Serviços Habilitados",
    label: "Criar Serviço Habilitado",
    value: "CRIAR_SERVICO_HABILITADO",
  },
  {
    modulo: "Serviços Habilitados",
    label: "Alterar Serviço Habilitado",
    value: "ALTERAR_SERVICO_HABILITADO",
  },
  {
    modulo: "Serviços Habilitados",
    label: "Visualizar Serviço Habilitado",
    value: "VISUALIZAR_SERVICO_HABILITADO",
  },
  {
    modulo: "Serviços Habilitados",
    label: "Excluir Serviço Habilitado",
    value: "EXCLUIR_SERVICO_HABILITADO",
  },

  {
    modulo: "Motivos de Bloqueio",
    label: "Listar Motivos de Bloqueio",
    value: "LISTAR_MOTIVO_BLOQUEIO",
  },
  {
    modulo: "Motivos de Bloqueio",
    label: "Criar Motivo de Bloqueio",
    value: "CRIAR_MOTIVO_BLOQUEIO",
  },
  {
    modulo: "Motivos de Bloqueio",
    label: "Alterar Motivo de Bloqueio",
    value: "ALTERAR_MOTIVO_BLOQUEIO",
  },
  {
    modulo: "Motivos de Bloqueio",
    label: "Excluir Motivo de Bloqueio",
    value: "EXCLUIR_MOTIVO_BLOQUEIO",
  },
  {
    modulo: "Motivos de Bloqueio",
    label: "Ativar/Desativar Motivo de Bloqueio",
    value: "ATIVAR_OU_DESATIVAR_MOTIVO_BLOQUEIO",
  },

  {
    modulo: "Usuários",
    label: "Listar Usuários",
    value: "LISTAR_USUARIOS",
  },
  {
    modulo: "Usuários",
    label: "Alterar Usuário",
    value: "ALTERAR_USUARIO",
  },
  {
    modulo: "Usuários",
    label: "Visualizar Usuário",
    value: "VISUALIZAR_USUARIO",
  },
  {
    modulo: "Usuários",
    label: "Excluir Usuário",
    value: "EXCLUIR_USUARIO",
  },
  {
    modulo: "Usuários",
    label: "Ativar/Desativar Usuário",
    value: "ATIVAR_OU_DESATIVAR_USUARIO",
  },

  {
    modulo: "Perfis",
    label: "Listar Perfis",
    value: "LISTAR_PERFIS",
  },
  {
    modulo: "Perfis",
    label: "Criar Perfil",
    value: "CRIAR_PERFIL",
  },
  {
    modulo: "Perfis",
    label: "Alterar Perfil",
    value: "ALTERAR_PERFIL",
  },
  {
    modulo: "Perfis",
    label: "Visualizar Perfil",
    value: "VISUALIZAR_PERFIL",
  },
  {
    modulo: "Perfis",
    label: "Excluir Perfil",
    value: "EXCLUIR_PERFIL",
  },
  {
    modulo: "Perfis",
    label: "Ativar/Desativar Perfil",
    value: "ATIVAR_OU_DESATIVAR_PERFIL",
  },
  {
    modulo: "Agendas",
    label: "Criar Configuração de Agendas",
    value: "CRIAR_CONFIGURACAO_AGENDA",
  },
  {
    modulo: "Agendas",
    label: "Listar Configuração de Agenda",
    value: "LISTAR_CONFIGURACAO_AGENDAS",
  },
  {
    modulo: "Agendas",
    label: "Visualizar Configuração Agenda",
    value: "VISUALIZAR_CONFIGURACAO_AGENDA",
  },
  {
    modulo: "Agendas",
    label: "Editar Agenda Configurada",
    value: "EDITAR_CONFIGURACAO_AGENDA",
  },
  {
    modulo: "Agendas",
    label: "Publicar/Despublicar Agenda",
    value: "PUBLICAR_OU_DESPUBLICAR_CONFIGURACAO_AGENDA",
  },
  {
    modulo: "Agendas",
    label: "Excluir Configuração",
    value: "EXCLUIR_CONFIGURACAO_AGENDA",
  },
  {
    modulo: "Gerenciamento de Agendas",
    label: "Visualizar Gestão de Agendas",
    value: "VISUALIZAR_GESTAO_AGENDAS",
  },
  {
    modulo: "Gerenciamento de Agendas",
    label: "Publicar/Despublicar Agenda",
    value: "PUBLICAR_OU_DESPUBLICAR_AGENDA",
  },
  {
    modulo: "Gerenciamento de Agendas",
    label: "Visualizar Agendamentos",
    value: "VISUALIZAR_AGENDAMENTOS",
  },
  {
    modulo: "Gerenciamento de Agendas",
    label: "Cancelar Agendamentos",
    value: "CANCELAR_AGENDAMENTOS",
  },
  {
    modulo: "Gerenciamento de Agendas",
    label: "Ajustar Vagas",
    value: "AJUSTAR_VAGAS",
  },
  {
    modulo: "Gerenciamento de Agendas",
    label: "Incluir Horário",
    value: "INCLUIR_HORARIO",
  },
  {
    modulo: "Gerenciamento de Agendas",
    label: "Bloquear/Desbloquear Horário",
    value: "BLOQUEAR_OU_DESBLOQUEAR_HORARIO",
  },
];

export const listaAutorizacao = permissoes.reduce((acc, p) => {
  const grupoExistente = acc.find((g) => g.titulo === p.modulo);
  if (grupoExistente) {
    grupoExistente.opcoes.push(p.label);
  } else {
    acc.push({ titulo: p.modulo, opcoes: [p.label] });
  }
  return acc;
}, [] as ListaAutorizacaoType);
