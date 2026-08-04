import { Plus, Star, Truck } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import { useSuppliers } from "../../hooks/useSuppliers";

const columns = [
  { header: "Supplier", key: "name", sortable: true, sortKey: "name" },
  { header: "Email", key: "email", sortable: true, sortKey: "email" },
  { header: "Phone", key: "phone", sortable: true, sortKey: "phone" },
  { header: "Rating", key: "rating", sortable: true, sortKey: "rating" },
  { header: "Delivery", key: "deliveryDays", sortable: true, sortKey: "deliveryDays" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
];

const Suppliers = () => {
  const { suppliers, isLoading, isError } = useSuppliers();

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load suppliers"
        description="Please refresh the page or try again later."
      />
    );
  }

  const active = suppliers.filter((s) => s.status === "ACTIVE").length;
  const avgRating =
    suppliers.length > 0
      ? (suppliers.reduce((sum, s) => sum + (s.rating ?? 0), 0) / suppliers.length).toFixed(1)
      : "—";

  return (
    <PageContainer>
      <PageHeader
        title="Suppliers"
        subtitle="Vendor network and procurement partners"
        action={<Button icon={Plus}>Add Supplier</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <KPICard title="Total Suppliers" value={suppliers.length} icon={Truck} color="primary" />
        <KPICard title="Active Vendors" value={active} color="success" />
        <KPICard title="Avg Rating" value={avgRating} icon={Star} color="warning" />
      </div>

      <DataTable
        data={suppliers}
        columns={columns}
        searchKeys={["name", "email", "phone", "status"]}
        searchPlaceholder="Search suppliers..."
        emptyTitle="No suppliers found"
        emptyDescription="Add suppliers to manage your procurement network."
        renderRow={(supplier) => (
          <TableRow key={supplier._id}>
            <TableCell>
              <span className="font-medium text-secondary-900">{supplier.name}</span>
            </TableCell>
            <TableCell className="text-secondary-500">{supplier.email ?? "—"}</TableCell>
            <TableCell className="text-secondary-500">{supplier.phone ?? "—"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-warning-500 text-warning-500" />
                <span className="font-medium">{supplier.rating ?? "—"}</span>
              </div>
            </TableCell>
            <TableCell>{supplier.deliveryDays ? `${supplier.deliveryDays} days` : "—"}</TableCell>
            <TableCell>
              <Badge color={supplier.status === "ACTIVE" ? "success" : "secondary"} dot>
                {supplier.status}
              </Badge>
            </TableCell>
          </TableRow>
        )}
      />
    </PageContainer>
  );
};

export default Suppliers;
