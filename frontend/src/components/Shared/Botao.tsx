import {
  CircleMinus,
  Plus,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Trash2,
  Pencil,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/shadcn/button";
import { cn } from "@/lib/utils";
import { ButtonVariantProps } from "../ui/shadcn/button-variants";

const iconClass = "size-5";

const ICON_MAP: Record<string, React.ReactNode> = {
  novo: <Plus />,
  pesquisar: <span className="material-symbols-outlined">search</span>,
  excluir: <Trash2 />,
  excluirCheio: (
    <span className="material-symbols-outlined !text-[20px]">cancel</span>
  ),
  "editar-config": <Pencil />,
  voltarIcone: (
    <span className="material-symbols-outlined">arrow_left_alt</span>
  ),
  removerSessao: <CircleMinus />,
  incluirSessao: <CirclePlus />,
  navegacaoAnterior: <ChevronLeft className={iconClass} />,
  navegacaoProximo: <ChevronRight className={iconClass} />,
};

interface BotaoProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  isLoading?: boolean;
  label?: string;
  icon?: React.ReactNode;
  iconPos?: "left" | "right";
}

const Botao = ({
  variant = "confirmar",
  size,
  isLoading,
  label,
  icon,
  iconPos,
  className,
  children,
  disabled,
  ...props
}: BotaoProps) => {
  const isNavigation =
    variant === "navegacaoAnterior" || variant === "navegacaoProximo";

  const finalIconPos =
    iconPos || (variant === "navegacaoProximo" ? "right" : "left");
  const finalLabel =
    label ||
    (variant === "navegacaoAnterior"
      ? "Anterior"
      : variant === "navegacaoProximo"
        ? "Próximo"
        : undefined);

  const renderIcon = () => {
    if (isLoading) return <Loader2 className="animate-spin" />;
    return icon || ICON_MAP[variant as string] || null;
  };

  return (
    <Button
      variant={variant}
      size={size || (isNavigation ? "pagination" : "default")}
      className={cn(isNavigation ? "gap-0.5" : "gap-2", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {renderIcon() && (finalIconPos === "left" || isLoading) && (
        <span className="flex shrink-0 items-center">{renderIcon()}</span>
      )}

      {(finalLabel || children) && (
        <span className="truncate">{finalLabel || children}</span>
      )}

      {renderIcon() && finalIconPos === "right" && !isLoading && (
        <span className="flex shrink-0 items-center">{renderIcon()}</span>
      )}
    </Button>
  );
};

export default Botao;
