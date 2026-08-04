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
        "rounded-xl border border-secondary-200 bg-white shadow-card",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-secondary-100/75 backdrop-blur-md">
            <tr className="border-b border-secondary-200">
              {columns.map((col) => (
                <th
                  key={col.key ?? col.header}
                  scope="col"
                  className={cn(
                    "px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-secondary-600",
                    col.sortable && "cursor-pointer select-none hover:text-secondary-900 transition-colors",
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

          <tbody className="divide-y divide-secondary-100/80 bg-white">{children}</tbody>
        </table>
      </div>
    </div>
  );
};

export const TableRow = ({ children, className = "", onClick }) => (
  <tr
    onClick={onClick}
    className={cn(
      "group transition-colors duration-150 hover:bg-secondary-50/80",
      onClick && "cursor-pointer",
      className,
    )}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = "" }) => (
  <td className={cn("px-5 py-4 text-[14px] text-secondary-700 align-middle", className)}>
    {children}
  </td>
);

export default Table;
