import {
  ConfiguracaoAgendaListagemCalendario,
  ConfiguracaoAgendaRequest,
} from "@/types/configuracaoAgenda";
import { TransformedFormTypes } from "@/types/general";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BotaoMenu, { Acao } from "./BotaoMenu";
import useActions from "@/hooks/useActions";

type ListagemBarraEventoProp<Type> = {
  item: Type;
  agenda: ConfiguracaoAgendaListagemCalendario;
  larguraDia?: number;
  dataSelecionada: Date;
  diasVisiveis: number;
  abrirModal: (
    id: number,
    nomeExibicao: string,
    status: string,
    tipo: "status" | "exclusao" | "publicacao",
    orgao?: string,
    unidade?: string,
    servicos?: string,
    periodoInicio?: string,
    periodoFim?: string,
    requestBody?: ConfiguracaoAgendaRequest,
    publicada?: boolean,
  ) => void;
  getActions?: (item: Type) => Acao[];
};

function ListagemBarraEvento<Type extends TransformedFormTypes>({
  item,
  agenda,
  larguraDia = 50,
  dataSelecionada,
  diasVisiveis,
  abrirModal,
  getActions,
}: ListagemBarraEventoProp<Type>) {
  const textoContainerRef = useRef<HTMLDivElement>(null);
  const [textoTruncado, setTextoTruncado] = useState(false);

  const normalizarData = (data: Date) => {
    const normalizada = new Date(data);
    normalizada.setHours(0, 0, 0, 0);
    return normalizada;
  };

  const inicioNormalizado = normalizarData(new Date(agenda.dataInicio));
  const fimNormalizado = normalizarData(new Date(agenda.dataFim));
  const baseNormalizada = normalizarData(dataSelecionada);

  const posicao = Math.floor(
    (inicioNormalizado.getTime() - baseNormalizada.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const duracao =
    Math.floor(
      (fimNormalizado.getTime() - inicioNormalizado.getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  const posicaoVisivel = Math.max(0, posicao);
  const diasAnterioresAreaVisivel = Math.max(0, -posicao);
  const posicaoFim = posicao + duracao;
  const foraDoRange = posicaoFim <= 0 || posicao >= diasVisiveis;

  const cortadoEsquerda = posicao < 0;
  const cortadoDireita = posicaoFim > diasVisiveis;

  const larguraAjustada = Math.min(
    (duracao - diasAnterioresAreaVisivel) * larguraDia,
    (diasVisiveis - posicaoVisivel) * larguraDia,
  );

  const textoPeriodo = duracao > 1 ? `${duracao} dias` : "1 dia";
  const textoCompletoTooltip = `${agenda.unidadeAtendimento} | ${agenda.siglasServicos} | ${textoPeriodo}`;

  const obterClassesBorda = () => {
    let classes = "border";

    if (cortadoEsquerda) {
      classes += " border-l-0 rounded-l-none";
    } else {
      classes += " rounded-l-sm";
    }

    if (cortadoDireita) {
      classes += " border-r-0 rounded-r-none";
    } else {
      classes += " rounded-r-sm";
    }

    return classes;
  };

  const ConteudoTexto = () => (
    <span className="text-[0.625rem] leading-6 font-normal uppercase">
      {agenda.unidadeAtendimento}
      <span
        className={`mx-2.5 ${
          agenda.publicada ? "text-[#337FFF]" : "text-[#FFCD48]"
        }`}
      >
        |
      </span>
      {agenda.siglasServicos}
      <span
        className={`mx-2.5 ${
          agenda.publicada ? "text-[#337FFF]" : "text-[#FFCD48]"
        }`}
      >
        |
      </span>
      {textoPeriodo}
    </span>
  );

  useEffect(() => {
    if (textoContainerRef.current) {
      const el = textoContainerRef.current;
      setTextoTruncado(el.scrollWidth > el.clientWidth);
    }
  }, [
    agenda.unidadeAtendimento,
    agenda.siglasServicos,
    textoPeriodo,
    larguraAjustada,
  ]);

  useEffect(() => {
    if (textoContainerRef.current) {
      const el = textoContainerRef.current;
      setTextoTruncado(el.scrollWidth > el.clientWidth);
    }
  }, [
    agenda.unidadeAtendimento,
    agenda.siglasServicos,
    textoPeriodo,
    larguraAjustada,
  ]);

  const hookActions = useActions(
    {
      id: agenda.id,
      nome: agenda.unidadeAtendimento,
      status: "",
      publicada: agenda.publicada,
      tipo: "agendas",
      agenda: agenda,
    },
    abrirModal,
    "agendas",
  );

  const acoes = getActions ? getActions(item) : hookActions;

  if (foraDoRange) {
    return <div className="relative h-8" />;
  }

  return (
    <div className="relative h-8">
      <Link
        to="/agendas/gerenciar-agenda/$id"
        params={{ id: String(agenda.id) }}
        className="cursor-default"
      >
        <motion.div
          className={`group absolute flex h-8 items-center px-2 text-xs shadow ${
            agenda.publicada
              ? `${obterClassesBorda()} border-[#337FFF]`
              : `${obterClassesBorda()} border-[#FFCD48]`
          }`}
          style={{
            left: posicaoVisivel * larguraDia,
            width: Math.max(larguraAjustada, larguraDia),
            backgroundColor: agenda.publicada ? "#E6F3FF" : "#FFF6CE",
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.02,
            y: -2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            backgroundColor: agenda.publicada ? "#99C6FF" : "#FFEA9D",
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
            layout: { duration: 0.3, ease: "easeInOut" },
          }}
          layout
        >
          <div className="flex flex-1 items-center overflow-hidden">
            {textoTruncado ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      ref={textoContainerRef}
                      className="min-w-[20px] flex-1 cursor-help truncate overflow-hidden"
                    >
                      <span>
                        <ConteudoTexto />
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-lg p-2 text-xs"
                    sideOffset={4}
                  >
                    {textoCompletoTooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div
                ref={textoContainerRef}
                className="flex min-w-[20px] flex-1 justify-center truncate overflow-hidden"
              >
                <span>
                  <ConteudoTexto />
                </span>
              </div>
            )}
          </div>

          <motion.div className="flex h-6 w-3 flex-shrink-0 items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <BotaoMenu acoes={acoes} variant="agenda" />
          </motion.div>
        </motion.div>
      </Link>
    </div>
  );
}

export default ListagemBarraEvento;
