import apiService from "@/service/BackofficeApiService";
import { ConfiguracaoAgendaRequest } from "@/types/configuracaoAgenda";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useState } from "react";
import { infoAlert, successAlert, warningAlert } from "@/utils/toastAlerts";
import { ModalItemInformationType, ModalType } from "@/types/modal";
import { formatarData } from "@/utils/dateUtils";

interface UseListagemModalProps {
  endpoint: string;
  chaveStatus?: string;
  invalidateKeys: (string | number)[][];
  entidade: string;
  onAfterChange?: () => void;
}

function useListagemModal({
  endpoint,
  chaveStatus,
  invalidateKeys,
  entidade,
  onAfterChange,
}: UseListagemModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState<ModalType>("status");
  const [itemSelecionado, setItemSelecionado] =
    useState<ModalItemInformationType | null>(null);
  const [requestBody, setRequestBody] =
    useState<ConfiguracaoAgendaRequest | null>(null);

  const nomeEntidadeFormatado: Record<string, string> = {
    "servico-habilitado": "serviço habilitado",
    "motivo-bloqueio": "motivo de bloqueio",
    perfil: "perfil",
    usuario: "usuário",
    agenda: "agenda",
  };

  const capitalize = (str?: string) =>
    (str?.charAt(0)?.toUpperCase() ?? "") + (str?.slice(1) ?? "");

  const abrirModal = (
    id: number,
    nomeExibicao: string,
    status: string,
    tipo: ModalType,
    orgao?: string,
    unidade?: string,
    servicos?: string,
    periodoInicio?: string,
    periodoFim?: string,
    requestBody?: ConfiguracaoAgendaRequest,
    publicada?: boolean
  ) => {
    const itemInformation: ModalItemInformationType = {
      id,
      status,
      nomeExibicao,
      orgao,
      unidade,
      servicos,
      periodoInicio,
      periodoFim,
      publicada,
    };

    setItemSelecionado(itemInformation);
    setModalTipo(tipo);
    setIsModalOpen(true);

    if (requestBody) {
      setRequestBody(requestBody);
    }
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setItemSelecionado(null);
    setModalTipo("status");
    setRequestBody(null);
  };

  const navigateToAgendas = () => {
    navigate({
      to: "/agendas",
      search: { pagina_atual: 1, registros_pagina: 25 },
    });
  };

  const mutationStatus = useMutation({
    mutationFn: async () => {
      if (!itemSelecionado || !chaveStatus) return;

      const novoStatus =
        itemSelecionado.status === "ATIVO" ? "INATIVO" : "ATIVO";

      await apiService.patch(`${endpoint}/${itemSelecionado.id}/status`, {
        [chaveStatus]: novoStatus,
      });
    },
    onSuccess: async () => {
      const nome = capitalize(nomeEntidadeFormatado[entidade] ?? entidade);
      successAlert(`${nome} atualizado com sucesso!`);

      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );

      fecharModal();
      onAfterChange?.();
    },
    onError: (err: unknown) => {
      const mensagemErro =
        err instanceof AxiosError && err.response?.data?.mensagem
          ? err.response.data.mensagem
          : "Erro ao atualizar o status.";

      abrirModalErro(mensagemErro);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async () => {
      if (!itemSelecionado) return;
      await apiService.delete(`${endpoint}/${itemSelecionado.id}`);
    },
    onSuccess: () => {
      const nome = capitalize(nomeEntidadeFormatado[entidade] ?? entidade);
      successAlert(`${nome} excluído com sucesso!`);

      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );

      fecharModal();
      onAfterChange?.();
    },
    onError: (err: unknown) => {
      const mensagemErro =
        err instanceof AxiosError && err.response?.data?.mensagem
          ? err.response.data.mensagem
          : "Erro ao excluir.";

      abrirModalErro(mensagemErro);
    },
  });

  const mutationCriacao = useMutation({
    mutationFn: async () => {
      if (!requestBody) return;
      const url = `${endpoint}?confirmar=true`;
      await apiService.post(url, requestBody);
    },
    onSuccess: async () => {
      const nome = capitalize(nomeEntidadeFormatado[entidade] ?? entidade);
      successAlert(`${nome} cadastrada com sucesso!`);

      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );

      fecharModal();
      navigateToAgendas();
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError && err.response?.status === 409) {
        abrirModalErro(err.response?.data.mensagem);
      } else {
        abrirModalErro("Erro ao criar.");
      }
    },
  });

  const mutationEdicao = useMutation({
    mutationFn: async () => {
      if (!requestBody) return;
      if (!itemSelecionado) return;
      const url = `${endpoint}/${itemSelecionado.id}?confirmar=true`;
      await apiService.put(url, requestBody);
    },
    onSuccess: async () => {
      const nome = capitalize(nomeEntidadeFormatado[entidade] ?? entidade);
      successAlert(`${nome} editada com sucesso!`);

      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );

      fecharModal();
      navigateToAgendas();
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError && err.response?.status === 409) {
        abrirModalErro(err.response?.data.mensagem);
      } else {
        abrirModalErro("Erro ao criar.");
      }
    },
  });

  const mutationPublicacao = useMutation({
    mutationFn: async () => {
      if (!itemSelecionado) return;
      await apiService.put(`${endpoint}/${itemSelecionado.id}/publicar`, null);
    },
    onSuccess: () => {
      const nome = capitalize(nomeEntidadeFormatado[entidade] ?? entidade);
      if (!itemSelecionado?.publicada) {
        successAlert(
          `${nome} salva e publicada com sucesso. Seus horários estão disponíveis para o público.`
        );
      } else {
        infoAlert(
          `${nome} despublicada. Os horários não estão mais acessíveis para agendamento.`
        );
      }

      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );

      fecharModal();
      onAfterChange?.();
    },
    onError: () => {
      warningAlert("Erro ao publicar/despublicar agenda.");
    },
  });

  const conflitoDeCriacao = (
    mensagem: string,
    requestData: ConfiguracaoAgendaRequest
  ) => {
    abrirModal(
      0,
      mensagem,
      "ATIVO",
      "criacao",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      requestData
    );
  };

  const conflitoDeEdicao = (
    id: number,
    mensagem: string,
    requestData: ConfiguracaoAgendaRequest
  ) => {
    abrirModal(
      id,
      mensagem,
      "ATIVO",
      "edicao",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      requestData
    );
  };

  const formatarPeriodo = (dataInicio?: string, dataFim?: string) => {
    if (!dataInicio || !dataFim) return "Data não informada";
    return `${formatarData(dataInicio)} a ${formatarData(dataFim)}`;
  };

  const confirmarAcao = () => {
    if (modalTipo === "status") mutationStatus.mutate();
    else if (modalTipo === "exclusao") mutationDelete.mutate();
    else if (modalTipo === "criacao") mutationCriacao.mutate();
    else if (modalTipo === "edicao") mutationEdicao.mutate();
    else if (modalTipo === "publicacao") mutationPublicacao.mutate();
  };

  const abrirModalErro = (mensagem: string) => {
    setItemSelecionado((prev) =>
      prev
        ? {
            ...prev,
            nomeExibicao: mensagem,
          }
        : { id: 0, nomeExibicao: mensagem, status: "ERRO" }
    );
    setIsModalOpen(true);
  };

  const formatarMensagemConflito = (mensagem: string, tipoAcao: string) => {
    const regex =
      /serviço\(s\) (.+?) na unidade (.+?) neste período (\d{4}-\d{2}-\d{2}) a (\d{4}-\d{2}-\d{2})\./;
    const match = mensagem.match(regex);

    if (!match) return mensagem;

    const [, servicos, unidade, dataInicio, dataFim] = match;

    return (
      <>
        Já existe uma agenda para o(s) serviço(s){" "}
        <span className="font-bold">{servicos}</span> na unidade{" "}
        <span className="font-bold">{unidade}</span> neste período{" "}
        <span className="font-bold">
          {formatarPeriodo(dataInicio, dataFim)}
        </span>
        . Deseja continuar com a {tipoAcao} da agenda?
      </>
    );
  };

  const definirTitulo = () => {
    const nome = itemSelecionado?.nomeExibicao ?? "";
    const status = itemSelecionado?.status;
    const nomeFormatado = nomeEntidadeFormatado[entidade] ?? entidade;

    if (entidade == "agenda") {
      if (modalTipo === "criacao") {
        return {
          titulo: "Conflito de agenda",
          mensagem: formatarMensagemConflito(nome, "criação"),
        };
      } else if (modalTipo === "edicao") {
        return {
          titulo: "Conflito de agenda",
          mensagem: formatarMensagemConflito(nome, "edição"),
        };
      } else if (modalTipo === "exclusao") {
        return {
          titulo: "Excluir configuração",
          mensagem: (
            <>
              Deseja excluir a agenda:
              <br />
              <br />
              <strong>Unidade:</strong> {itemSelecionado?.unidade}
              <br />
              <strong>Serviços:</strong> {itemSelecionado?.servicos}
              <br />
              <strong>Período:</strong>{" "}
              {formatarPeriodo(
                itemSelecionado?.periodoInicio,
                itemSelecionado?.periodoFim
              )}
            </>
          ),
        };
      } else if (modalTipo === "publicacao") {
        if (itemSelecionado?.publicada === false) {
          return {
            titulo: "Publicar agenda",
            mensagem: (
              <>
                Deseja realmente <strong>publicar</strong> esta agenda? Ela
                ficará visível no portal do cidadão e disponível para novos
                agendamentos de acordo com a sua configuração.
                <br />
                <br />
                <strong>Unidade:</strong> {itemSelecionado?.unidade}
                <br />
                <strong>Serviços:</strong> {itemSelecionado?.servicos}
                <br />
                <strong>Período:</strong>{" "}
                {formatarPeriodo(
                  itemSelecionado?.periodoInicio,
                  itemSelecionado?.periodoFim
                )}
              </>
            ),
          };
        } else {
          return {
            titulo: "Despublicar agenda",
            mensagem: (
              <>
                Deseja realmente <strong>despublicar</strong> esta agenda? Ela
                será ocultada do portal do cidadão e não estará mais disponível
                para novos agendamentos.
                <br />
                <br />
                <strong>Unidade:</strong> {itemSelecionado?.unidade}
                <br />
                <strong>Serviços:</strong> {itemSelecionado?.servicos}
                <br />
                <strong>Período:</strong>{" "}
                {formatarPeriodo(
                  itemSelecionado?.periodoInicio,
                  itemSelecionado?.periodoFim
                )}
              </>
            ),
          };
        }
      }
    }

    if (modalTipo === "exclusao") {
      return {
        titulo: `Excluir ${nomeFormatado}`,
        mensagem: (
          <>
            Deseja realmente excluir o {entidade}:{" "}
            <span className="font-bold">{nome}</span>?
          </>
        ),
      };
    }

    return {
      titulo:
        status === "ATIVO"
          ? `Desativar ${nomeFormatado}`
          : `Ativar ${nomeFormatado}`,
      mensagem:
        status === "ATIVO" ? (
          <>
            Deseja realmente desativar o {entidade}:{" "}
            <span className="font-bold">{nome}</span>?
          </>
        ) : (
          <>
            Deseja realmente ativar: <span className="font-bold">{nome}</span>?
          </>
        ),
    };
  };

  return {
    isModalOpen,
    definirTitulo,
    abrirModal,
    fecharModal,
    confirmarAcao,
    conflitoDeCriacao,
    conflitoDeEdicao,
    itemSelecionado,
  };
}

export default useListagemModal;
