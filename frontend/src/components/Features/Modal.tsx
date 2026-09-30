import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ModalSize } from "@/interfaces/Modal";
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
  size?: ModalSize;
  minSize?: Exclude<ModalSize, "auto">;
};

const sizeMap: Record<Exclude<ModalSize, "auto">, string> = {
  sm: "37.5rem",
  md: "50rem",
  lg: "70rem",
  xl: "81.25rem",
};

const viewportMaxWidth = "calc(100vw - 32px)";

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  modal = true,
  showCloseButton = true,
  size = "auto",
  minSize,
}: ModalFlutuanteProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [extraWidth, setExtraWidth] = useState(0);

  const baseMinWidth = minSize ? sizeMap[minSize] : undefined;

  const calculatedMinWidth =
    size === "auto" && baseMinWidth
      ? `min(${baseMinWidth}, ${viewportMaxWidth})`
      : undefined;

  const calculatedMaxWidth =
    size === "auto"
      ? viewportMaxWidth
      : `min(${sizeMap[size]}, ${viewportMaxWidth})`;

  useLayoutEffect(() => {
    if (size !== "auto" || !isOpen) {
      setExtraWidth(0);
      return;
    }

    const element = contentRef.current;
    if (!element) return;

    const measureOverflow = () => {
      let overflow = 0;
      element.querySelectorAll<HTMLElement>("*").forEach((node) => {
        const diff = node.scrollWidth - node.clientWidth;
        if (diff > overflow) overflow = diff;
      });

      if (overflow > 1) {
        setExtraWidth((prev) => prev + overflow);
      }
    };

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [isOpen, size]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      modal={modal}
    >
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <DialogContent
        className={cn(
          "flex h-auto max-h-[80vh] flex-col overflow-hidden p-0",
          size === "auto" ? "w-max" : "w-full",
          !showCloseButton && "[&>button]:hidden",
        )}
        style={{
          zIndex: 50,
          maxWidth: calculatedMaxWidth,
          minWidth:
            extraWidth > 0
              ? `min(calc(${calculatedMinWidth ?? "0px"} + ${extraWidth}px), ${viewportMaxWidth})`
              : calculatedMinWidth,
        }}
        aria-describedby={description ? "modal-description" : undefined}
      >
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle
                className={cn(
                  "text-lg leading-[1.4] font-bold tracking-[-0.15px] text-foreground",
                  "m-0 border-b border-border p-4",
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

        <div
          ref={contentRef}
          className="flex min-h-0 flex-1 flex-col overflow-x-hidden"
        >
          {children}
        </div>

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
