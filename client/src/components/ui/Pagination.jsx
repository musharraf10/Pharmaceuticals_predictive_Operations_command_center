import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "./Button";
import { cn } from "../../utils/cn";

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-secondary-200 dark:border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-[13px] text-secondary-500 dark:text-slate-400">
        Showing {start}–{end} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>

        <span className="px-3 text-sm font-medium text-secondary-700 dark:text-slate-200">
          {page} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
