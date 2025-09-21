// function Sidepanel({ isOpen, onClose, children }) {
//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="sidepanel">
//       {children}
//       <button onClick={onClose}>Fechar</button>
//     </div>
//   );
// }

// export default Sidepanel;

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/shadcn/sheet";

interface SidepanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Sidepanel({
  isOpen,
  onClose,
  children,
  title,
  description,
}: SidepanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="absolute top-10 right-0 bottom-0 h-auto w-[clamp(300px,45%,800px)] overflow-y-auto bg-white shadow-lg"
      >
        <SheetHeader>
          {title && (
            <SheetTitle className="m-4 py-4 text-xl leading-7 font-bold text-[#28272C]">
              {title}
            </SheetTitle>
          )}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div>{children}</div>
      </SheetContent>
    </Sheet>
  );
}
