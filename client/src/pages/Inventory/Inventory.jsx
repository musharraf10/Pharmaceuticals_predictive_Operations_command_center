import { AlertTriangle, Boxes, Plus } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import { useInventory } from "../../hooks/useInventory";
import { formatDate } from "../../utils/formatDate";
import { INVENTORY_STATUS } from "../../utils/statusConfig";

const columns = [
  { header: "Product", key: "product", sortable: true, sortKey: "product.name" },
  { header: "Warehouse", key: "warehouse", sortable: true, sortKey: "warehouse" },
  { header: "Quantity", key: "quantity", sortable: true, sortKey: "quantity" },
  { header: "Location", key: "location", sortable: true, sortKey: "location" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
  { header: "Expiry", key: "expiryDate", sortable: true, sortKey: "expiryDate" },
];

const Inventory = () => {
  const { inventory, isLoading, isError } = useInventory();

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load inventory"
        description="Please refresh the page or try again later."
      />
    );
  }

  const lowStock = inventory.filter((i) => i.status === "LOW_STOCK").length;
  const outOfStock = inventory.filter((i) => i.status === "OUT_OF_STOCK").length;
  const available = inventory.filter((i) => i.status === "AVAILABLE").length;

  return (
    <PageContainer>
      <PageHeader
        title="Inventory"
        subtitle="Real-time stock levels across warehouses"
        action={<Button icon={Plus}>Add Stock</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Items" value={inventory.length} icon={Boxes} color="primary" />
        <KPICard title="Available" value={available} color="success" />
        <KPICard title="Low Stock" value={lowStock} icon={AlertTriangle} color="warning" />
        <KPICard title="Out of Stock" value={outOfStock} color="danger" />
      </div>

      <DataTable
        data={inventory}
        columns={columns}
        searchKeys={["product.name", "warehouse", "location", "status"]}
        searchPlaceholder="Search inventory..."
        emptyTitle="No inventory records"
        emptyDescription="Stock levels will appear here once products are added."
        renderRow={(item) => (
          <TableRow key={item._id}>
            <TableCell>
              <span className="font-medium text-secondary-900">
                {item.product?.name ?? "—"}
              </span>
            </TableCell>
            <TableCell>{item.warehouse}</TableCell>
            <TableCell>
              <span className="font-semibold text-secondary-900">{item.quantity}</span>
            </TableCell>
            <TableCell className="text-secondary-500">{item.location || "—"}</TableCell>
            <TableCell>
              <StatusBadge statusMap={INVENTORY_STATUS} status={item.status} />
            </TableCell>
            <TableCell className="text-secondary-500">
              {formatDate(item.expiryDate)}
            </TableCell>
          </TableRow>
        )}
      />
    </PageContainer>
  );
};

export default Inventory;
