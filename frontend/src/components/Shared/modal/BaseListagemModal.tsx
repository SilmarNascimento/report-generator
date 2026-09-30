import Modal from "@/components/Features/Modal";
import { ModalSize } from "@/interfaces/Modal";
import { cn } from "@/lib/utils";
import { ButtonVariantProps } from "../../ui/shadcn/button-variants";
import Botao from "../Botao";

export type BaseModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  isLoading?: boolean;
  confirmDisabled?: boolean;
  variant?: ButtonVariantProps["variant"];
  size?: ModalSize;
  children: React.ReactNode;
};

export function BaseListagemModal({
  isOpen,
  title,
  onClose,
  onConfirm,
  confirmLabel = "Confirmar",
  isLoading,
  confirmDisabled,
  variant = "confirmar",
  size = "auto",
  children,
}: BaseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <section
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          size === "auto" && "max-w-150",
        )}
      >
        <section className="min-h-0 flex-1 overflow-y-auto px-6 pt-2 pb-6 text-base text-[#28272C]">
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
            disabled={confirmDisabled}
            isLoading={isLoading}
          />
        </section>
      </section>
    </Modal>
  );
}
