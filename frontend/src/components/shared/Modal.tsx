import React, { useEffect, useRef } from "react";
import Botao from "./Botao";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  idItem?: number;
  headerClassName?: string;
  footerClassName?: string;
  maxWidth?: string; 
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmLabel,
  idItem,
  headerClassName = "",
  footerClassName = "",
  maxWidth = "80vw",
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const closeButton = modalRef.current.querySelector<HTMLButtonElement>(
        '[aria-label="Fechar"]'
      );
      if (closeButton) {
        closeButton.focus();
      }

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      modalRef.current.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const uniqueId = `modal-title-${idItem || Math.random()}`;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FFFFFF8C] text-base"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={uniqueId}
    >
      <div
        className="relative z-[10000] flex w-fit max-w-[90vw] min-w-[300px] flex-col rounded-2xl bg-white font-sans text-[#2C2E34] shadow-lg"
        style={{ maxWidth: maxWidth }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 ${headerClassName}`}>
          <h2 id={uniqueId} className="font-semibold">
            {title}
          </h2>
          <button
            aria-label="Fechar"
            className="cursor-pointer text-[#7F86A0] hover:text-gray-700"
            onClick={onClose}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto border-t border-b border-[#fffff]/80 p-6">
          <div className="w-full py-2 text-base leading-7.5 font-normal whitespace-pre-line">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-auto flex justify-end gap-4 p-6 ${footerClassName}`}>
          <Botao perfil="cancelar" onClick={onClose} />
          {onConfirm && (
            <Botao
              perfil="confirmar"
              onClick={onConfirm}
              label={confirmLabel ?? "Confirmar"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;