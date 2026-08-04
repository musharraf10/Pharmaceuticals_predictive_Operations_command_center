import { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit3, Plus, Star, Trash2, Truck } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import { useSuppliers } from "../../hooks/useSuppliers";

const columns = [
  { header: "Supplier", key: "name", sortable: true, sortKey: "name" },
  { header: "Email", key: "email", sortable: true, sortKey: "email" },
  { header: "Phone", key: "phone", sortable: true, sortKey: "phone" },
  { header: "Rating", key: "rating", sortable: true, sortKey: "rating" },
  { header: "Delivery", key: "deliveryDays", sortable: true, sortKey: "deliveryDays" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
  { header: "Actions", key: "actions", className: "text-right" },
];

const defaults = {
  name: "",
  email: "",
  phone: "",
  rating: 5,
  deliveryDays: 7,
  status: "ACTIVE",
};

const Suppliers = () => {
  const {
    suppliers,
    isLoading,
    isError,
    createSupplierAsync,
    updateSupplierAsync,
    deleteSupplierAsync,
    isCreating,
    isUpdating,
  } = useSuppliers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const form = useForm({ defaultValues: defaults });

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return <EmptyState title="Unable to load suppliers" description="Please refresh the page or try again later." />;
  }

  const active = suppliers.filter((s) => s.status === "ACTIVE").length;
  const avgRating = suppliers.length > 0 ? (suppliers.reduce((sum, s) => sum + (s.rating ?? 0), 0) / suppliers.length).toFixed(1) : "-";

  const openCreate = () => {
    setEditingSupplier(null);
    form.reset(defaults);
    setModalOpen(true);
  };

  const openEdit = (supplier) => {
    setEditingSupplier(supplier);
    form.reset({
      name: supplier.name ?? "",
      email: supplier.email ?? "",
      phone: supplier.phone ?? "",
      rating: supplier.rating ?? 5,
      deliveryDays: supplier.deliveryDays ?? 7,
      status: supplier.status ?? "ACTIVE",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSupplier(null);
    form.reset(defaults);
  };

  const saveSupplier = async (values) => {
    const payload = {
      ...values,
      rating: Number(values.rating),
      deliveryDays: Number(values.deliveryDays),
    };
    if (editingSupplier) {
      await updateSupplierAsync({ id: editingSupplier._id, payload });
    } else {
      await createSupplierAsync(payload);
    }
    closeModal();
  };

  return (
    <PageContainer>
      <PageHeader title="Suppliers" subtitle="Vendor network and procurement partners" action={<Button icon={Plus} onClick={openCreate}>Add Supplier</Button>} />

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
            <TableCell><span className="font-medium text-secondary-900">{supplier.name}</span></TableCell>
            <TableCell className="text-secondary-500">{supplier.email ?? "-"}</TableCell>
            <TableCell className="text-secondary-500">{supplier.phone ?? "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-warning-500 text-warning-500" />
                <span className="font-medium">{supplier.rating ?? "-"}</span>
              </div>
            </TableCell>
            <TableCell>{supplier.deliveryDays ? `${supplier.deliveryDays} days` : "-"}</TableCell>
            <TableCell>
              <Badge color={supplier.status === "ACTIVE" ? "success" : "secondary"} dot>{supplier.status}</Badge>
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <Button size="sm" variant="outline" icon={Edit3} onClick={() => openEdit(supplier)}>Edit</Button>
                <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deleteSupplierAsync(supplier._id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modalOpen}
        title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="supplier-form" loading={isCreating || isUpdating}>{editingSupplier ? "Save Changes" : "Create Supplier"}</Button>
          </>
        }
      >
        <form id="supplier-form" onSubmit={form.handleSubmit(saveSupplier)} className="space-y-4">
          <Input label="Supplier Name" error={form.formState.errors.name?.message} {...form.register("name", { required: "Supplier name is required" })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Email" type="email" {...form.register("email")} />
            <Input label="Phone" {...form.register("phone")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Rating" type="number" min="1" max="5" {...form.register("rating")} />
            <Input label="Delivery Days" type="number" min="0" {...form.register("deliveryDays")} />
            <Select label="Status" options={[{ label: "Active", value: "ACTIVE" }, { label: "Inactive", value: "INACTIVE" }]} {...form.register("status")} />
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Suppliers;
