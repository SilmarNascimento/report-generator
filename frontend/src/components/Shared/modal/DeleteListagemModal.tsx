import { BaseListagemModal } from "./BaseListagemModal";

type DeleteProps = {
  isOpen: boolean;
  nome: string;
  entidade: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function DeleteListagemModal({
  isOpen,
  nome,
  entidade,
  onClose,
  onConfirm,
  isLoading,
}: DeleteProps) {
  return (
    <BaseListagemModal
      isOpen={isOpen}
      title={`Excluir ${entidade}`}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      confirmLabel="Excluir"
      variant="excluir"
    >
      <p>
        Deseja realmente excluir o(s) item(s) selecionado(s):{" "}
        <strong>{nome}</strong>?
      </p>
    </BaseListagemModal>
  );
}
