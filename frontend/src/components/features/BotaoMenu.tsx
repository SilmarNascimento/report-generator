import { MoreVertical } from "lucide-react";
import React, { useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";

export type Acao = {
  label: string;
  icon?: string | React.ReactNode;
  onClick?: () => void;
  status?: "ativo" | "inativo";
};

type BotaoMenuProps = {
  acoes: Acao[];
  variant?: "default" | "agenda" | "gerenciar-agenda";
};

const BotaoMenu: React.FC<BotaoMenuProps> = ({
  acoes,
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isAgenda = variant === "agenda";

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(
        isAgenda
          ? { mainAxis: 8, alignmentAxis: -4 }
          : { mainAxis: 8, alignmentAxis: 12 },
      ),
      flip(),
      shift(),
    ],
    placement: "bottom-end",
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const filteredAcoes = acoes.filter(
    ({ label, status }) =>
      !(label === "Ativar" && status === "ativo") &&
      !(label === "Desativar" && status === "inativo"),
  );

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={
          isAgenda
            ? "cursor-pointer items-center rounded-full p-1.25 outline-none"
            : "cursor-pointer self-start rounded-full p-2 hover:bg-gray-200 focus:outline-none"
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        <MoreVertical size={isAgenda ? 14 : 18} />
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={`menu-dropdown z-50 rounded-lg border border-gray-300 bg-white shadow-lg ${
              isAgenda
                ? "w-[186px] divide-y divide-[#E7E9EB] overflow-hidden"
                : "max-h-[calc(100vh-20px)] w-[235px] overflow-y-auto"
            }`}
          >
            {filteredAcoes.map(({ label, icon, onClick }) => (
              <button
                key={label}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClick?.();
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center text-left focus:outline-none ${
                  isAgenda
                    ? "group h-10 bg-white py-2 pr-6 pl-2 text-[#0034B7] hover:bg-[#0034B7]"
                    : "h-16 px-4 py-2 hover:bg-gray-100"
                }`}
              >
                {icon && (
                  <div
                    className={`flex items-center ${
                      isAgenda ? "mr-1" : "mr-[5.6px]"
                    } ${isAgenda ? "text-[#0034B7] group-hover:text-white" : ""}`}
                  >
                    {typeof icon === "string" ? (
                      <span className="material-symbols-outlined">{icon}</span>
                    ) : (
                      icon
                    )}
                  </div>
                )}
                <span
                  className={
                    isAgenda
                      ? "text-[12px] font-normal whitespace-nowrap text-[#0034B7] group-hover:text-white"
                      : ""
                  }
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default BotaoMenu;
