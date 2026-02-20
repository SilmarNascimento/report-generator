import {
  CircleMinus,
  Plus,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Trash2,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/shadcn/button";

type ButtonStyle = {
  className: string;
  label?: string;
  icon?: React.ReactNode;
  iconPos?: "left" | "top" | "bottom" | "right";
};

type ButtonStylesObject = {
  [key: string]: ButtonStyle;
};

type BotaoProps = {
  perfil?:
    | "novo"
    | "salvar"
    | "confirmar"
    | "pesquisar"
    | "alterar"
    | "invisivel"
    | "voltar"
    | "voltarIcone"
    | "cancelar"
    | "excluir"
    | "excluir2"
    | "editar configuracoes"
    | "removerSessao"
    | "incluirSessao"
    | "navegacaoAnterior"
    | "navegacaoProximo";
  label?: string;
  type?: "submit" | "button";
  onClick?: (() => void) | (() => Promise<void>);
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
};

const iconClass = "w-5 h-5";

const buttonStyles: ButtonStylesObject = {
  novo: {
    className:
      "bg-secondary hover:bg-secondary/80 text-background font-medium h-10 py-2 px-4 mx-2",
    label: "Novo",
    icon: <Plus className={iconClass} />,
    iconPos: "left",
  },
  salvar: {
    className:
      "bg-secondary hover:bg-secondary/80 text-background font-medium h-10 py-2 px-4 mx-2",
    label: "Salvar",
    iconPos: "left",
  },
  confirmar: {
    className: "bg-secondary text-background font-medium h-10 py-2 px-4",
    label: "Confirmar",
    iconPos: "left",
  },
  pesquisar: {
    className: "bg-secondary text-background font-medium h-10 py-2 px-4",
    label: "Pesquisar",
    icon: <span className="material-symbols-outlined">search</span>,
    iconPos: "right",
  },
  alterar: {
    className: "bg-secondary text-background font-medium h-10 py-2 px-4",
    label: "Alterar",
    iconPos: "left",
  },
  voltar: {
    className:
      "bg-background! font-medium text-ring h-10 py-2 px-4 border border-secondary",
    label: "Voltar",
    iconPos: "left",
  },
  invisivel: {
    className: "bg-background! font-medium text-secondary h-10 py-2 px-4",
    label: "Voltar",
    iconPos: "left",
  },
  voltarIcone: {
    className:
      "bg-transparent! font-medium text-secondary h-10 py-2 px-4 border border-border",
    label: "Voltar",
    icon: <span className="material-symbols-outlined">arrow_left_alt</span>,
    iconPos: "left",
  },
  cancelar: {
    className:
      "bg-transparent! font-medium text-secondary h-10 py-2 px-4 border border-border",
    label: "Cancelar",
    iconPos: "left",
  },
  excluir: {
    className:
      "text-destructive! bg-transparent hover:bg-transparent! border border-destructive",
    label: "Excluir",
    icon: <Trash2 className={`text-destructive ${iconClass}`} />,
    iconPos: "left",
  },
  excluir2: {
    className:
      "h-10 text-white bg-destructive border border-destructive !hover:opacity-80!",
    label: "Excluir",
    icon: (
      <span className="material-symbols-outlined !text-[20px]">cancel</span>
    ),
    iconPos: "left",
  },
  "editar configuracoes": {
    className:
      "w-50 h-10 text-white! bg-secondary hover:opacity-80! border border-secondary",
    label: "Editar Configurações",
    icon: <Pencil className={`text-white ${iconClass}`} />,
    iconPos: "left",
  },
  removerSessao: {
    className: "text-destructive! bg-transparent hover:bg-transparent!",
    icon: <CircleMinus className={`text-destructive ${iconClass}`} />,
    iconPos: "left",
  },
  incluirSessao: {
    className:
      "bg-transparent font-medium text-secondary px-4 py-2 gap-1.5 hover: bg-transparent!",
    icon: <CirclePlus className={`text-secondary ${iconClass}`} />,
    iconPos: "left",
  },
  navegacaoAnterior: {
    className:
      "border rounded-[0.25rem] w-[6.25rem] h-[2rem] font-normal border-ring text-ring bg-background! disabled:bg-muted-foreground! disabled:text-primary-foreground disabled:border-none",
    label: "Anterior",
    icon: <ChevronLeft className={iconClass} />,
    iconPos: "left",
  },
  navegacaoProximo: {
    className:
      "border rounded-[0.25rem] w-[6.25rem] h-[2rem] font-normal border-ring text-ring bg-background! disabled:bg-muted-foreground! disabled:text-primary-foreground disabled:border-none",
    label: "Próximo",
    icon: <ChevronRight className={iconClass} />,
    iconPos: "right",
  },
};

const Botao = ({
  perfil = "confirmar",
  label,
  onClick,
  disabled,
  className,
  type,
  autoFocus = false,
}: BotaoProps) => {
  const style: ButtonStyle = buttonStyles[perfil] ?? buttonStyles.confirmar;

  const customGapClass =
    perfil === "navegacaoAnterior" || perfil === "navegacaoProximo"
      ? "gap-0.5"
      : "gap-2";

  return (
    <Button
      autoFocus={autoFocus}
      type={type ?? "button"}
      className={cn(
        "flex items-center justify-center rounded-lg hover:opacity-90",
        {
          "opacity-80": disabled,
        },
        style.className,
        customGapClass,
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {style.icon && style.iconPos === "left" && (
        <span className="flex items-center">{style.icon}</span>
      )}

      {(label ?? style.label) && <span>{label ?? style.label}</span>}

      {style.icon && style.iconPos === "right" && (
        <span className="flex items-center">{style.icon}</span>
      )}
    </Button>
  );
};

export default Botao;
