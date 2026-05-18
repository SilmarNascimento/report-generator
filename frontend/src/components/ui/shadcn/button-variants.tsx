import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        confirmar: "bg-secondary text-background font-medium hover:opacity-80",
        cancelar:
          "bg-background text-secondary border border-secondary hover:bg-transparent",
        voltar:
          "bg-background text-ring border border-secondary hover:bg-accent",
        excluir:
          "text-destructive rounded-lg border border-destructive bg-transparent hover:bg-destructive/10",
        muted: "bg-muted text-muted-foreground hover:bg-muted/80",
        excluirCheio: "bg-destructive text-white hover:opacity-80",
        novo: "bg-secondary text-background font-medium hover:opacity-90",
        pesquisar: "bg-secondary text-background font-medium hover:opacity-90",
        alterar: "bg-secondary text-background font-medium hover:opacity-90",
        invisivel: "bg-transparent text-secondary hover:bg-secondary/5",
        "editar-config":
          "w-50 bg-secondary text-white hover:opacity-80 border border-secondary",
        navegacaoAnterior:
          "border rounded-[0.25rem] font-normal border-ring text-ring bg-background! disabled:bg-muted-foreground! disabled:text-primary-foreground disabled:border-none",
        navegacaoProximo:
          "border rounded-[0.25rem] font-normal border-ring text-ring bg-background! disabled:bg-muted-foreground! disabled:text-primary-foreground disabled:border-none",

        sessao:
          "bg-transparent shadow-none focus:ring-0 focus:outline-none hover:bg-accent/10",
        removerSessao:
          "text-destructive! bg-transparent hover:bg-transparent! shadow-none focus:ring-0",
        incluirSessao:
          "bg-transparent font-medium text-secondary hover:bg-transparent! shadow-none focus:ring-0",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-8 has-[>svg]:px-4",
        icon: "size-9",
        pagination: "w-[6.25rem] h-[2rem]",
      },
    },
    defaultVariants: {
      variant: "confirmar",
      size: "default",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
