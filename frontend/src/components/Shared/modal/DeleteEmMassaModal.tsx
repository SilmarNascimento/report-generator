import { BaseListagemModal } from "./BaseListagemModal";

type DeleteEmMassaModalProps = {
  isOpen: boolean;
  quantidade: number;
  entidade: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function DeleteEmMassaModal({
  isOpen,
  quantidade,
  entidade,
  onClose,
  onConfirm,
  isLoading,
}: DeleteEmMassaModalProps) {
  return (
    <BaseListagemModal
      isOpen={isOpen}
      title={`Excluir ${entidade}s Selecionados`}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      confirmLabel="Excluir"
      variant="excluir"
    >
      <p>Deseja excluir o(s) <strong>{quantidade}</strong> item(s) selecionado(s)? Esta ação não pode ser desfeita.</p>
    </BaseListagemModal>
  );
}
