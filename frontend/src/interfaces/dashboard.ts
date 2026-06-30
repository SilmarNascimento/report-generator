import { BadgeDropdownType } from "./general";

export type DashboardFilterFormType = {
  year: string;
  mockExamIds: BadgeDropdownType[];
};

export type SimuladoParticipacaoType = {
  simuladoNome: string;
  quantidade: number;
};

export type SimuladoMediaType = {
  simuladoNome: string;
  mediaAcertos: number;
};

export type SimuladoAcertosType = {
  simuladoNome: string;
  acertos: number;
};

export type AreaDesempenhoType = {
  area: string;
  media: number;
};

export type DificuldadeDesempenhoType = {
  nivel: string;
  media: number;
};

export type AssuntoDesempenhoType = {
  assunto: string;
  media: number;
};

export type Top5AssuntoType = {
  rank: number;
  assunto: string;
  taxaErro: number;
};

export type MediaGeralType = {
  acertos: number;
  total: number;
};

export type PontuacaoDetalheType = {
  acertos: number;
  total: number;
  simuladoNome: string;
};

export type AssuntoRevisaoType = {
  assunto: string;
  prioridade: "ALTA" | "MEDIA" | "BAIXA";
};

export type GlobalDashboardType = {
  mediaGeralAcertos: number;
  pontuacaoMaxima: number;
  pontuacaoMinima: number;
  indiceCoerenciaMedio: number;
  participacaoPorSimulado: SimuladoParticipacaoType[];
  desempenhoAcumuladoPorSimulado: SimuladoMediaType[];
  desempenhoAreaMate: AreaDesempenhoType[];
  desempenhoPorDificuldade: DificuldadeDesempenhoType[];
  desempenhoPorAssunto: AssuntoDesempenhoType[];
  top5AssuntosComMaisErros: Top5AssuntoType[];
};

export type IndividualDashboardType = {
  studentName: string;
  mediaGeralAcertos: MediaGeralType;
  pontuacaoMaxima: PontuacaoDetalheType;
  pontuacaoMinima: PontuacaoDetalheType;
  indiceCoerenciaMedio: number;
  desempenhoAcumuladoPorSimulado: SimuladoAcertosType[];
  desempenhoAreaMate: AreaDesempenhoType[];
  desempenhoPorDificuldade: DificuldadeDesempenhoType[];
  desempenhoPorAssunto: AssuntoDesempenhoType[];
  top3AssuntosParaRevisar: AssuntoRevisaoType[];
};
