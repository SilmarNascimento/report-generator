import { MenuOption } from "@/types/general";
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
import { useEffect } from "react";

type MenuFlutuanteProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  options: MenuOption[];
  reference: HTMLElement | null;
};

export default function MenuFlutuante({
  isOpen,
  onClose,
  options,
  reference,
}: MenuFlutuanteProps) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: onClose,
    placement: "bottom-end",
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (reference) {
      refs.setReference(reference);
    }
  }, [reference, refs]);

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="menu-dropdown z-50 w-50 divide-y divide-[#E7E9EB] overflow-hidden rounded-lg border border-[#E7E9EB] bg-white shadow-lg"
          >
            {options.map((option) => (
              <button
                key={option.label}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  option.onClick?.();
                  onClose();
                }}
                className="group flex h-10 w-full cursor-pointer items-center gap-1 bg-white p-2.5 py-2 pr-6 pl-2 text-left text-[#0034B7] hover:bg-[#0034B7] focus:outline-none"
              >
                {option.icon && <span>{option.icon}</span>}
                <span className="text-xs leading-4.5 font-normal whitespace-nowrap group-hover:text-white">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
