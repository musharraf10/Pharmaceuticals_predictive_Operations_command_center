import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { cn } from "../../utils/cn";

const SortIcon = ({ active, direction }) => {
  if (!active) return <ArrowUpDown size={14} className="text-secondary-400" />;
  return direction === "asc" ? (
    <ArrowUp size={14} className="text-primary-600" />
  ) : (
    <ArrowDown size={14} className="text-primary-600" />
  );
};

const Table = ({
  columns = [],
  children,
  sortKey,
  sortDir,
  onSort,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-card",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="sticky top-0 z-10 bg-secondary-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key ?? col.header}
                  scope="col"
                  className={cn(
                    "px-6 py-3.5 text-left text-[13px] font-semibold uppercase tracking-wide text-secondary-500",
                    col.sortable && "cursor-pointer select-none hover:text-secondary-700",
                    col.className,
                  )}
                  onClick={
                    col.sortable && onSort
                      ? () => onSort(col.sortKey ?? col.key)
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <SortIcon
                        active={sortKey === (col.sortKey ?? col.key)}
                        direction={sortDir}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-secondary-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
};

export const TableRow = ({ children, className = "", onClick }) => (
  <tr
    onClick={onClick}
    className={cn(
      "transition-colors duration-150 hover:bg-secondary-50",
      onClick && "cursor-pointer",
      className,
    )}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = "" }) => (
  <td className={cn("px-6 py-4 text-[15px] text-secondary-700", className)}>
    {children}
  </td>
);

export default Table;
