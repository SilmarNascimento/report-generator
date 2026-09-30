import { ReactNode } from "react";

type CabecalhoListagemProps = {
  titulo: ReactNode;
  children?: ReactNode;
};

const CabecalhoListagem = ({ titulo, children }: CabecalhoListagemProps) => {
  return (
    <div className="mt-3 flex items-center justify-between gap-3">
      <h1 className="text-xl font-bold">{titulo}</h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export default CabecalhoListagem;
