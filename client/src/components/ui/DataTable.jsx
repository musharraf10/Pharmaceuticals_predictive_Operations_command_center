import Card from "./Card";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import Search from "./Search";
import Table, { TableCell, TableRow } from "./Table";
import { useTable } from "../../hooks/useTable";

const DataTable = ({
  data = [],
  columns = [],
  searchKeys = [],
  searchPlaceholder = "Search records...",
  pageSize = 8,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search or filters.",
  toolbar,
  renderRow,
}) => {
  const table = useTable(data, { pageSize, searchKeys });

  return (
    <Card padding={false} className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-secondary-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <Search
          value={table.search}
          onChange={table.setSearch}
          placeholder={searchPlaceholder}
          className="w-full sm:max-w-xs"
        />
        {toolbar}
      </div>

      {table.allData.length === 0 ? (
        <div className="p-6">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            sortKey={table.sortKey}
            sortDir={table.sortDir}
            onSort={table.toggleSort}
            className="rounded-none border-0 shadow-none"
          >
            {table.data.map((row, index) => renderRow(row, index))}
          </Table>

          <div className="px-6 pb-6">
            <Pagination
              page={table.page}
              totalPages={table.totalPages}
              onPageChange={table.setPage}
              totalItems={table.totalItems}
              pageSize={table.pageSize}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export { TableCell, TableRow };
export default DataTable;
