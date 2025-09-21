import { useMemo } from "react";
import Botao from "../shared/Botao";

interface PaginationProps {
  page: number;
  items: number;
  totalItems: number;
  pages: number;
  onPageChange;
  searchParams: Record<string, unknown>;
  setSearchParams: (params: Record<string, string>) => void;
}

const RodapePaginacao = ({
  items,
  page,
  pages,
  totalItems,
  onPageChange,
  searchParams,
  setSearchParams,
}: PaginationProps) => {
  const pageSize = searchParams.registros_pagina ?? "25";
  const pageSizeOptions = ["25", "50", "100"];

  const updatePageSize = (value: string) => {
    setSearchParams({
      ...searchParams,
      pagina_atual: "1",
      registros_pagina: value,
    });
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pages) return;

    setSearchParams({
      ...searchParams,
      pagina_atual: String(newPage),
    });
  };

  const pageNumbers = useMemo(() => {
    const numbers: (number | string)[] = [];
    if (pages <= 5) {
      for (let i = 1; i <= pages; i++) numbers.push(i);
    } else {
      numbers.push(1, 2);

      if (page > 3) numbers.push("...");

      if (page > 2 && page < pages - 1) {
        if (page - 1 > 2) numbers.push(page - 1);
        numbers.push(page);
        if (page + 1 < pages - 1) numbers.push(page + 1);
      }
      if (page < pages - 2) numbers.push("...");

      numbers.push(pages - 1, pages);
    }
    return numbers;
  }, [page, pages]);

  const primeiroItem = (page - 1) * Number(pageSize) + 1;
  const ultimoItem = primeiroItem + items - 1;

  return (
    <div
      className={`flex w-full items-center justify-start text-base sm:text-sm md:justify-center`}
    >
      {pages >= 1 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-6">
          <Botao
            perfil="navegacaoAnterior"
            label="Anterior"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 text-xs sm:text-sm"
          />

          <div className="flex items-center gap-1 sm:gap-2">
            {pageNumbers.map((pageItem, index) => (
              <button
                key={
                  typeof pageItem === "number" ? pageItem : `ellipsis-${index}`
                }
                onClick={() =>
                  typeof pageItem === "number" && changePage(pageItem)
                }
                disabled={typeof pageItem !== "number"}
                className={`h-6 w-6 cursor-pointer rounded border text-xs font-bold ${
                  pageItem === page
                    ? "border-blue-600 bg-white text-blue-600"
                    : "border-gray-300 text-gray-600"
                } ${pageItem === "..." ? "text-gray-400" : ""} ${typeof pageItem !== "number" ? "cursor-default" : ""}`}
                aria-label={
                  typeof pageItem === "number"
                    ? `Página ${pageItem}`
                    : undefined
                }
              >
                {pageItem}
              </button>
            ))}
          </div>

          <Botao
            perfil="navegacaoProximo"
            label="Próximo"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            className="px-2 py-1 text-xs sm:text-sm"
          />

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden text-gray-600 sm:block">
              ({primeiroItem}-{ultimoItem} de {totalItems})
            </span>

            <div className="flex items-center gap-1">
              <span className="hidden text-gray-600 sm:block">Por página:</span>
              {pageSizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => updatePageSize(size)}
                  className={`cursor-pointer px-1 py-0.5 text-xs ${
                    size === pageSize
                      ? "font-bold text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RodapePaginacao;
