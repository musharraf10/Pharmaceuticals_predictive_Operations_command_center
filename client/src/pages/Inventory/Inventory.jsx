import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertTriangle, Boxes, Edit3, Plus, Trash2 } from "lucide-react";

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
import { useInventory } from "../../hooks/useInventory";
import { useProducts } from "../../hooks/useProducts";
import { formatDate } from "../../utils/formatDate";
import { INVENTORY_STATUS } from "../../utils/statusConfig";

const columns = [
  { header: "Product", key: "product", sortable: true, sortKey: "product.name" },
  { header: "Warehouse", key: "warehouse", sortable: true, sortKey: "warehouse" },
  { header: "Quantity", key: "quantity", sortable: true, sortKey: "quantity" },
  { header: "Location", key: "location", sortable: true, sortKey: "location" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
  { header: "Expiry", key: "expiryDate", sortable: true, sortKey: "expiryDate" },
  { header: "Actions", key: "actions", className: "text-right" },
];

const defaults = {
  product: "",
  quantity: 0,
  warehouse: "Main Warehouse",
  location: "",
  status: "AVAILABLE",
  expiryDate: "",
};

const Inventory = () => {
  const {
    inventory,
    isLoading,
    isError,
    createInventoryAsync,
    updateInventoryAsync,
    deleteInventoryAsync,
    isCreating,
    isUpdating,
  } = useInventory();
  const { products } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const form = useForm({ defaultValues: defaults });

  const productOptions = useMemo(
    () => products.map((product) => ({ label: `${product.name} (${product.sku})`, value: product._id })),
    [products],
  );

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return <EmptyState title="Unable to load inventory" description="Please refresh the page or try again later." />;
  }

  const lowStock = inventory.filter((i) => i.status === "LOW_STOCK").length;
  const outOfStock = inventory.filter((i) => i.status === "OUT_OF_STOCK").length;
  const available = inventory.filter((i) => i.status === "AVAILABLE").length;

  const openCreate = () => {
    setEditingItem(null);
    form.reset(defaults);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    form.reset({
      product: item.product?._id ?? item.product ?? "",
      quantity: item.quantity ?? 0,
      warehouse: item.warehouse ?? "Main Warehouse",
      location: item.location ?? "",
      status: item.status ?? "AVAILABLE",
      expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    form.reset(defaults);
  };

  const saveInventory = async (values) => {
    const payload = { ...values, quantity: Number(values.quantity), expiryDate: values.expiryDate || undefined };
    if (editingItem) {
      await updateInventoryAsync({ id: editingItem._id, payload });
    } else {
      await createInventoryAsync(payload);
    }
    closeModal();
  };

  return (
    <PageContainer>
      <PageHeader title="Inventory" subtitle="Real-time stock levels across warehouses" action={<Button icon={Plus} onClick={openCreate}>Add Stock</Button>} />

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
            <TableCell><span className="font-semibold text-secondary-900 dark:text-white">{item.product?.name ?? "-"}</span></TableCell>
            <TableCell className="font-medium text-secondary-800 dark:text-slate-200">{item.warehouse}</TableCell>
            <TableCell><span className="font-bold text-secondary-900 dark:text-white">{item.quantity}</span></TableCell>
            <TableCell className="text-secondary-500 dark:text-slate-300">{item.location || "-"}</TableCell>
            <TableCell><StatusBadge statusMap={INVENTORY_STATUS} status={item.status} /></TableCell>
            <TableCell className="text-secondary-500 dark:text-slate-300">{formatDate(item.expiryDate)}</TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <Button size="sm" variant="outline" icon={Edit3} onClick={() => openEdit(item)}>Edit</Button>
                <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deleteInventoryAsync(item._id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modalOpen}
        title={editingItem ? "Edit Stock" : "Add Stock"}
        onClose={closeModal}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="inventory-form" loading={isCreating || isUpdating}>{editingItem ? "Save Changes" : "Add Stock"}</Button>
          </>
        }
      >
        <form id="inventory-form" onSubmit={form.handleSubmit(saveInventory)} className="space-y-4">
          <Select label="Product" placeholder="Choose product" options={productOptions} error={form.formState.errors.product?.message} {...form.register("product", { required: "Product is required" })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Warehouse" {...form.register("warehouse", { required: "Warehouse is required" })} />
            <Input label="Location" {...form.register("location")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Quantity" type="number" min="0" {...form.register("quantity", { required: "Quantity is required" })} />
            <Select label="Status" options={Object.keys(INVENTORY_STATUS).map((value) => ({ label: INVENTORY_STATUS[value].label, value }))} {...form.register("status")} />
            <Input label="Expiry Date" type="date" {...form.register("expiryDate")} />
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Inventory;
