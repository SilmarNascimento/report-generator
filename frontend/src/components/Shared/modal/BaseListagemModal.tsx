import Modal from "@/components/Features/Modal";
import { ButtonVariantProps } from "../../ui/shadcn/button-variants";
import Botao from "../Botao";

export type BaseModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  isLoading?: boolean;
  variant?: ButtonVariantProps["variant"];
  children: React.ReactNode;
};

export function BaseListagemModal({
  isOpen,
  title,
  onClose,
  onConfirm,
  confirmLabel = "Confirmar",
  isLoading,
  variant = "confirmar",
  children,
}: BaseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <section className="max-w-150">
        <section className="px-6 pt-2 pb-6 text-base text-[#28272C]">
          {children}
        </section>

        <section className="flex justify-end gap-4 border-t p-4">
          <Botao
            variant="cancelar"
            label="Cancelar"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          />
          <Botao
            variant={variant === "excluir" ? "confirmar" : variant}
            label={confirmLabel}
            className={variant === "excluir" ? "bg-destructive text-white" : ""}
            type="button"
            onClick={onConfirm}
            isLoading={isLoading}
          />
        </section>
      </section>
    </Modal>
  );
}
