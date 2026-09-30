import { ReactNode } from "react";
import { larguraPagina } from "@/lib/layout";
import { cn } from "@/lib/utils";

type PaginaContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Container padrão do conteúdo das páginas. Usa a mesma largura máxima
 * da barra de navegação, definida em `larguraPagina`.
 */
const PaginaContainer = ({ children, className }: PaginaContainerProps) => {
  return (
    <main className={cn(larguraPagina, "space-y-5", className)}>
      {children}
    </main>
  );
};

export default PaginaContainer;
