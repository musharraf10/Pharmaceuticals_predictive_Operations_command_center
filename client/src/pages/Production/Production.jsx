import { Factory, Plus } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import { useProduction } from "../../hooks/useProduction";
import { formatDate } from "../../utils/formatDate";
import { BATCH_STATUS } from "../../utils/statusConfig";

const columns = [
  { header: "Batch #", key: "batchNumber", sortable: true, sortKey: "batchNumber" },
  { header: "Product", key: "product", sortable: true, sortKey: "product.name" },
  { header: "Quantity", key: "quantity", sortable: true, sortKey: "quantity" },
  { header: "Line", key: "productionLine", sortable: true, sortKey: "productionLine" },
  { header: "Quality", key: "qualityScore", sortable: true, sortKey: "qualityScore" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
  { header: "Expiry", key: "expiryDate", sortable: true, sortKey: "expiryDate" },
];

const Production = () => {
  const { batches, isLoading, isError } = useProduction();

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load production batches"
        description="Please refresh the page or try again later."
      />
    );
  }

  const inProgress = batches.filter((b) => b.status === "IN_PROGRESS").length;
  const completed = batches.filter((b) => b.status === "COMPLETED").length;
  const rejected = batches.filter((b) => b.status === "REJECTED").length;

  return (
    <PageContainer>
      <PageHeader
        title="Production"
        subtitle="Manufacturing batches and quality control"
        action={<Button icon={Plus}>New Batch</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Batches" value={batches.length} icon={Factory} color="primary" />
        <KPICard title="In Progress" value={inProgress} color="info" />
        <KPICard title="Completed" value={completed} color="success" />
        <KPICard title="Rejected" value={rejected} color="danger" />
      </div>

      <DataTable
        data={batches}
        columns={columns}
        searchKeys={["batchNumber", "product.name", "productionLine", "status"]}
        searchPlaceholder="Search batches..."
        emptyTitle="No production batches"
        emptyDescription="Create a batch to start manufacturing tracking."
        renderRow={(batch) => (
          <TableRow key={batch._id}>
            <TableCell>
              <code className="rounded-md bg-secondary-100 px-2 py-0.5 text-[13px] font-medium">
                {batch.batchNumber}
              </code>
            </TableCell>
            <TableCell className="font-medium">{batch.product?.name ?? "—"}</TableCell>
            <TableCell className="font-semibold">{batch.quantity}</TableCell>
            <TableCell className="text-secondary-500">{batch.productionLine}</TableCell>
            <TableCell>
              <span className="font-medium text-secondary-900">{batch.qualityScore}%</span>
            </TableCell>
            <TableCell>
              <StatusBadge statusMap={BATCH_STATUS} status={batch.status} />
            </TableCell>
            <TableCell className="text-secondary-500">{formatDate(batch.expiryDate)}</TableCell>
          </TableRow>
        )}
      />
    </PageContainer>
  );
};

export default Production;
