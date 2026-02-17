import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "./ui/shadcn/button";
import { SelectPageSize } from "./ui/selectPageSize";

interface PaginationProps {
  page: number;
  items: number;
  totalItems: number;
  pages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

export function PaginationFromList({
  items,
  page,
  pages,
  totalItems,
  setCurrentPage,
  setPageSize,
}: PaginationProps) {
  function firstPage() {
    setCurrentPage(1);
  }

  function previousPage() {
    if (page - 1 <= 0) {
      return;
    }
    setCurrentPage((prev) => prev - 1);
  }

  function nextPage() {
    if (page + 1 > pages) {
      return;
    }
    setCurrentPage((prev) => prev + 1);
  }

  function lastPage() {
    setCurrentPage(pages);
  }

  return (
    <div className="flex text-sm items-center justify-between text-zinc-500">
      <span>
        Showing {items} of {totalItems} items
      </span>
      <div className="flex items-center gap-8">
        {pages >= 2 && (
          <>
            <span>
              Page {page} of {pages}
            </span>
            <div className="space-x-1.5">
              <Button
                onClick={firstPage}
                size="icon"
                variant="secondary"
                disabled={page - 1 <= 0}
              >
                <ChevronsLeft className="size-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                onClick={previousPage}
                size="icon"
                variant="secondary"
                disabled={page - 1 <= 0}
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                onClick={nextPage}
                size="icon"
                variant="secondary"
                disabled={page + 1 > pages}
              >
                <ChevronRight className="size-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                onClick={lastPage}
                size="icon"
                variant="secondary"
                disabled={page + 1 > pages}
              >
                <ChevronsRight className="size-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <SelectPageSize setPageSize={setPageSize} />
        </div>
      </div>
    </div>
  );
}
