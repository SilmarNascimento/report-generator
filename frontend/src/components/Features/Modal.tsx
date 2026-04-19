import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/shadcn/dialog";

type ModalFlutuanteProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  modal?: boolean;
  showCloseButton?: boolean;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  modal = true,
  showCloseButton = true,
}: ModalFlutuanteProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      modal={modal}
    >
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <DialogContent
        className={cn(
          "p-0 sm:max-w-fit",
          !showCloseButton && "[&>button]:hidden",
        )}
        style={{ zIndex: 50 }}
        aria-describedby={description ? "modal-description" : undefined}
      >
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle
                className={cn(
                  "text-lg leading-[1.4] font-bold tracking-[-0.15px] text-[#28272C]",
                  "m-0 border-b border-[#CED2D7] p-4",
                )}
              >
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription id="modal-description">
                {description}
              </DialogDescription>
            )}
            {!description && (
              <DialogDescription id="modal-description" className="sr-only">
                {title || "Modal de confirmação"}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div>{children}</div>

        {footer && (
          <DialogFooter onClick={(e) => e.stopPropagation()}>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

Modal.displayName = "Modal";
export default Modal;
