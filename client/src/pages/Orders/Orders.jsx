import { MoreHorizontal, Plus, ShoppingCart } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import Dropdown, { DropdownItem } from "../../components/ui/Dropdown";
import EmptyState from "../../components/ui/EmptyState";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import { useOrders } from "../../hooks/useOrders";
import { formatDate } from "../../utils/formatDate";
import { ORDER_STATUS } from "../../utils/statusConfig";

const columns = [
  { header: "Customer", key: "customer", sortable: true, sortKey: "customerName" },
  { header: "Product", key: "product", sortable: true, sortKey: "product.name" },
  { header: "Quantity", key: "quantity", sortable: true, sortKey: "quantity" },
  { header: "Destination", key: "destination", sortable: true, sortKey: "destination" },
  { header: "Order Date", key: "orderDate", sortable: true, sortKey: "orderDate" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
  { header: "", key: "actions" },
];

const Orders = () => {
  const { orders, isLoading, isError } = useOrders();

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load orders"
        description="Please refresh the page or try again later."
      />
    );
  }

  const pending = orders.filter((o) => o.status === "PENDING").length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <PageContainer>
      <PageHeader
        title="Orders"
        subtitle="Order fulfillment pipeline and delivery tracking"
        action={<Button icon={Plus}>Create Order</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <KPICard title="Total Orders" value={orders.length} icon={ShoppingCart} color="primary" />
        <KPICard title="Pending" value={pending} color="warning" />
        <KPICard title="Delivered" value={delivered} color="success" />
      </div>

      <DataTable
        data={orders}
        columns={columns}
        searchKeys={["customerName", "product.name", "destination", "status"]}
        searchPlaceholder="Search orders..."
        emptyTitle="No orders found"
        emptyDescription="Create your first order to start fulfillment."
        renderRow={(order) => (
          <TableRow key={order._id}>
            <TableCell>
              <span className="font-medium text-secondary-900">{order.customerName}</span>
            </TableCell>
            <TableCell>{order.product?.name ?? "—"}</TableCell>
            <TableCell className="font-semibold">{order.quantity}</TableCell>
            <TableCell className="text-secondary-500">{order.destination}</TableCell>
            <TableCell className="text-secondary-500">{formatDate(order.orderDate)}</TableCell>
            <TableCell>
              <StatusBadge statusMap={ORDER_STATUS} status={order.status} />
            </TableCell>
            <TableCell>
              <Dropdown
                trigger={
                  <button className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100">
                    <MoreHorizontal size={18} />
                  </button>
                }
              >
                <DropdownItem>View Details</DropdownItem>
                <DropdownItem>Update Status</DropdownItem>
              </Dropdown>
            </TableCell>
          </TableRow>
        )}
      />
    </PageContainer>
  );
};

export default Orders;
