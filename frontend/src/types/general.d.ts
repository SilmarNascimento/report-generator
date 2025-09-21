import { FormularioMotivoBloqueioType } from "@/components/forms/motivo-bloqueio/formularioMotivoBloqueioSchema";
import { FormularioPerfilType } from "@/components/forms/perfil/formularioPerfilSchema";
import { FormularioServicoHabilitadoType } from "@/components/forms/servicos-habilitados/formularioServicoHabilitadoSchema";
import { FormularioUsuarioType } from "@/components/forms/usuario/formularioUsuarioSchema";
import { MotivoBloqueioTransformed } from "./motivoBloqueio";
import { ServicoHabilitadoTransformed } from "./servicoHabilitado";
import { PerfilTransformed } from "./perfil";
import { UsuarioTransformed } from "./usuario";
import { FormularioAgendaType } from "@/components/forms/agenda/formularioAgendaSchema";
import { FiltrosListagemAgendasType } from "@/components/listagens/agenda/listagemAgendasSchema";
import { FormularioGerenciarAgendaType } from "@/components/forms/gerenciar-agenda/FormularioGerenciarAgenda";
import { ReactNode } from "react";
import { FormularioIncluirHorarioType } from "@/components/forms/gerenciar-agenda/incluir-horario/formularioIncluirHorariosSchema";
import { FormularioBloqueioHorarioType } from "@/components/forms/gerenciar-agenda/bloquear-horario/formularioBloquearHorarioSchema";

type ListaPaginada<T> = {
  dados: T[];
  paginacao: Paginacao;
};

type MenuOption = {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
};

export type Paginacao = {
  pagina_atual: number;
  registros_pagina: number;
  total_paginas: number;
  total_registros: number;
};

export type DropdownType = {
  label: string;
  value: string;
};

export type BadgeDropdownType = {
  dropdownLabel: string;
  displayLabel: string;
  value: string;
};

export type RangeFieldError = {
  from?: FieldError;
  to?: FieldError;
};

export type FormTypes =
  | FormularioUsuarioType
  | FormularioPerfilType
  | FormularioServicoHabilitadoType
  | FormularioMotivoBloqueioType
  | FormularioAgendaType
  | FiltrosListagemAgendasType
  | FormularioGerenciarAgendaType
  | FormularioIncluirHorarioType
  | FormularioBloqueioHorarioType;

export type TransformedFormTypes =
  | MotivoBloqueioTransformed
  | ServicoHabilitadoTransformed
  | PerfilTransformed
  | UsuarioTransformed
  | ConfiguracaoAgendaListagemCalendario;

export interface HorarioComIndex<T> {
  horario: T;
  index: number;
}

export interface PeriodoComIndex {
  index: number;
  inicio: Date;
  fim: Date;
}
