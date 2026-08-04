import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit3, Plus, Send, ShoppingCart, Trash2 } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
import { useOrders } from "../../hooks/useOrders";
import { useProducts } from "../../hooks/useProducts";
import { formatDate } from "../../utils/formatDate";
import { ORDER_STATUS } from "../../utils/statusConfig";

const columns = [
  { header: "Customer", key: "customer", sortable: true, sortKey: "customerName" },
  { header: "Product", key: "product", sortable: true, sortKey: "product.name" },
  { header: "Quantity", key: "quantity", sortable: true, sortKey: "quantity" },
  { header: "Destination", key: "destination", sortable: true, sortKey: "destination" },
  { header: "Expected", key: "expectedDelivery", sortable: true, sortKey: "expectedDelivery" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
  { header: "Actions", key: "actions", className: "text-right" },
];

const statusOptions = Object.keys(ORDER_STATUS).map((value) => ({
  label: ORDER_STATUS[value].label,
  value,
}));

const defaults = {
  product: "",
  quantity: 1,
  customerName: "",
  destination: "",
  expectedDelivery: "",
  status: "PENDING",
  remarks: "",
};

const Orders = () => {
  const {
    orders,
    isLoading,
    isError,
    createOrderAsync,
    updateOrderAsync,
    updateOrderStatusAsync,
    deleteOrderAsync,
    isCreating,
    isUpdating,
  } = useOrders();
  const { products } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const form = useForm({ defaultValues: defaults });

  const productOptions = useMemo(
    () => products.map((product) => ({ label: `${product.name} (${product.sku})`, value: product._id })),
    [products],
  );

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return <EmptyState title="Unable to load orders" description="Please refresh the page or try again later." />;
  }

  const pending = orders.filter((o) => o.status === "PENDING").length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;

  const openCreate = () => {
    setEditingOrder(null);
    form.reset(defaults);
    setModalOpen(true);
  };

  const openEdit = (order) => {
    setEditingOrder(order);
    form.reset({
      product: order.product?._id ?? order.product ?? "",
      quantity: order.quantity ?? 1,
      customerName: order.customerName ?? "",
      destination: order.destination ?? "",
      expectedDelivery: order.expectedDelivery ? order.expectedDelivery.slice(0, 10) : "",
      status: order.status ?? "PENDING",
      remarks: order.remarks ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingOrder(null);
    form.reset(defaults);
  };

  const saveOrder = async (values) => {
    const payload = {
      ...values,
      quantity: Number(values.quantity),
      expectedDelivery: values.expectedDelivery || undefined,
    };
    if (editingOrder) {
      await updateOrderAsync({ id: editingOrder._id, payload });
    } else {
      await createOrderAsync(payload);
    }
    closeModal();
  };

  return (
    <PageContainer>
      <PageHeader title="Orders" subtitle="Order fulfillment pipeline and delivery tracking" action={<Button icon={Plus} onClick={openCreate}>Create Order</Button>} />

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
            <TableCell><span className="font-semibold text-secondary-900 dark:text-white">{order.customerName}</span></TableCell>
            <TableCell><span className="font-medium text-secondary-800 dark:text-slate-200">{order.product?.name ?? "-"}</span></TableCell>
            <TableCell className="font-bold text-secondary-900 dark:text-white">{order.quantity}</TableCell>
            <TableCell className="text-secondary-600 dark:text-slate-300">{order.destination}</TableCell>
            <TableCell className="text-secondary-500 dark:text-slate-300">{formatDate(order.expectedDelivery)}</TableCell>
            <TableCell className="w-48">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatusAsync({ id: order._id, payload: { status: e.target.value } })}
                className="w-full cursor-pointer rounded-xl border border-secondary-200 dark:border-slate-700 bg-secondary-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-secondary-800 dark:text-white transition hover:border-primary-400 focus:border-primary-600 focus:outline-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <Button size="sm" variant="outline" icon={Edit3} onClick={() => openEdit(order)}>Edit</Button>
                {order.status !== "DISPATCHED" && order.status !== "DELIVERED" && (
                  <Button size="sm" variant="secondary" icon={Send} onClick={() => updateOrderStatusAsync({ id: order._id, payload: { status: "DISPATCHED" } })}>Dispatch</Button>
                )}
                <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deleteOrderAsync(order._id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modalOpen}
        title={editingOrder ? "Edit Order" : "Create Order"}
        onClose={closeModal}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="order-form" loading={isCreating || isUpdating}>{editingOrder ? "Save Changes" : "Create Order"}</Button>
          </>
        }
      >
        <form id="order-form" onSubmit={form.handleSubmit(saveOrder)} className="space-y-4">
          <Select label="Product" placeholder="Choose product" options={productOptions} error={form.formState.errors.product?.message} {...form.register("product", { required: "Product is required" })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Customer Name" error={form.formState.errors.customerName?.message} {...form.register("customerName", { required: "Customer is required" })} />
            <Input label="Destination" error={form.formState.errors.destination?.message} {...form.register("destination", { required: "Destination is required" })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Quantity" type="number" min="1" {...form.register("quantity", { required: "Quantity is required" })} />
            <Input label="Expected Delivery" type="date" {...form.register("expectedDelivery")} />
            <Select label="Status" options={statusOptions} {...form.register("status")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700 dark:text-slate-300">Remarks</label>
            <textarea rows={3} className="w-full rounded-xl border border-secondary-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-[15px] text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-slate-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100" {...form.register("remarks")} />
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Orders;
