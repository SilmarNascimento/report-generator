import { SearchParams } from "@/utils/setUrlSearch";

interface PaginationProps {
  page: number;
  pages: number;
  totalItems: number;
  items: number;
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
}

export function Pagination({
  page,
  pages,
  totalItems,
  items,
  searchParams,
  setSearchParams,
}: PaginationProps) {
  function firstPage() {
    setSearchParams({ page: 1 });
  }

  function previousPage() {
    if (page > 1) {
      setSearchParams({ page: page - 1 });
    }
  }

  function nextPage() {
    if (page < pages) {
      setSearchParams({ page: page + 1 });
    }
  }

  function lastPage() {
    setSearchParams({ page: pages });
  }

  function changePageSize(size: number) {
    setSearchParams({
      page: 1,
      pageSize: size,
    });
  }

  return (
    <div className="flex items-center justify-between text-sm text-zinc-500">
      <span>
        Showing {items} of {totalItems} items
      </span>

      {pages >= 2 && (
        <div className="flex items-center gap-2">
          <button onClick={firstPage} disabled={page === 1}>
            ⏮
          </button>
          <button onClick={previousPage} disabled={page === 1}>
            ◀
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button onClick={nextPage} disabled={page === pages}>
            ▶
          </button>
          <button onClick={lastPage} disabled={page === pages}>
            ⏭
          </button>

          <select
            value={searchParams.pageSize ?? 10}
            onChange={(e) => changePageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}
    </div>
  );
}
