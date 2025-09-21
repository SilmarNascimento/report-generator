import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/shadcn/dialog";
import { useRef } from "react";

type ModalFlutuanteProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function ModalFlutuante({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalFlutuanteProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="modal-flutuante sm:max-w-fit"
        //onInteractOutside={(e) => e.preventDefault()}
        style={{ zIndex: 50 }}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="border-t border-[#CED2D7] py-4" ref={dialogRef}>
          {children}
        </div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
