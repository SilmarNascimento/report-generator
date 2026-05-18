import { ModalItemInformationType, ModalType } from "@/interfaces/Modal";
import { DeleteListagemModal } from "./DeleteListagemModal";

interface ModalRendererProps {
  isOpen: boolean;
  tipo: ModalType;
  entidade: string;
  item: ModalItemInformationType | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ModalRenderer({
  isOpen,
  tipo,
  entidade,
  item,
  isLoading,
  onClose,
  onConfirm,
}: ModalRendererProps) {
  if (!isOpen || !item) return null;

  const commonProps = {
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    entidade,
    nome: item.nomeExibicao,
  };

  const renderMap: Record<ModalType, React.ReactNode> = {
    exclusao: <DeleteListagemModal {...commonProps} />,

    status: null,
    publicacao: null,
    criacao: null,
    edicao: null,
  };

  return renderMap[tipo] ?? null;
}
