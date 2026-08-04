import { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit3, Eye, Plus, Star, Trash2, Truck } from "lucide-react";

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
  { header: "Contact Person", key: "contactPerson", sortable: true, sortKey: "contactPerson" },
  { header: "Phone", key: "phone", sortable: true, sortKey: "phone" },
  { header: "Rating", key: "rating", sortable: true, sortKey: "rating" },
  { header: "Delivery", key: "deliveryDays", sortable: true, sortKey: "deliveryDays" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
  { header: "Actions", key: "actions", className: "text-right" },
];

const defaults = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
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
  const [viewingSupplier, setViewingSupplier] = useState(null);

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
      contactPerson: supplier.contactPerson ?? "",
      email: supplier.email ?? "",
      phone: supplier.phone ?? "",
      address: supplier.address ?? "",
      rating: supplier.rating ?? 5,
      deliveryDays: supplier.deliveryDays ?? 7,
      status: supplier.status ?? "ACTIVE",
    });
    setModalOpen(true);
  };

  const openView = (supplier) => {
    setViewingSupplier(supplier);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSupplier(null);
    form.reset(defaults);
  };

  const closeViewModal = () => {
    setViewingSupplier(null);
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
        searchKeys={["name", "contactPerson", "email", "phone", "address", "status"]}
        searchPlaceholder="Search suppliers..."
        emptyTitle="No suppliers found"
        emptyDescription="Add suppliers to manage your procurement network."
        renderRow={(supplier) => (
          <TableRow key={supplier._id}>
            <TableCell><span className="font-semibold text-secondary-900 dark:text-white">{supplier.name}</span></TableCell>
            <TableCell className="text-secondary-700 dark:text-slate-200">{supplier.contactPerson ?? "-"}</TableCell>
            <TableCell className="text-secondary-500 dark:text-slate-300">{supplier.phone ?? "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-warning-500 text-warning-500" />
                <span className="font-semibold text-secondary-900 dark:text-white">{supplier.rating ?? "-"}</span>
              </div>
            </TableCell>
            <TableCell className="text-secondary-700 dark:text-slate-200">{supplier.deliveryDays !== undefined && supplier.deliveryDays !== null ? `${supplier.deliveryDays} days` : "-"}</TableCell>
            <TableCell>
              <Badge color={supplier.status === "ACTIVE" ? "success" : "secondary"} dot>{supplier.status}</Badge>
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <Button size="sm" variant="ghost" icon={Eye} onClick={() => openView(supplier)}>View</Button>
                <Button size="sm" variant="outline" icon={Edit3} onClick={() => openEdit(supplier)}>Edit</Button>
                <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deleteSupplierAsync(supplier._id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Add / Edit Supplier Modal */}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Supplier Name *" error={form.formState.errors.name?.message} {...form.register("name", { required: "Supplier name is required" })} />
            <Input label="Contact Person *" error={form.formState.errors.contactPerson?.message} {...form.register("contactPerson", { required: "Contact person is required" })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Email *" type="email" error={form.formState.errors.email?.message} {...form.register("email", { required: "Email address is required" })} />
            <Input label="Phone *" error={form.formState.errors.phone?.message} {...form.register("phone", { required: "Phone number is required" })} />
          </div>
          <Input label="Address *" error={form.formState.errors.address?.message} {...form.register("address", { required: "Address is required" })} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Rating (1-5)" type="number" min="1" max="5" error={form.formState.errors.rating?.message} {...form.register("rating", { required: "Rating is required", min: { value: 1, message: "Rating must be at least 1" }, max: { value: 5, message: "Rating cannot exceed 5" } })} />
            <Input label="Delivery Days *" type="number" min="0" error={form.formState.errors.deliveryDays?.message} {...form.register("deliveryDays", { required: "Delivery days is required", min: { value: 0, message: "Delivery days cannot be negative" } })} />
            <Select label="Status" options={[{ label: "Active", value: "ACTIVE" }, { label: "Inactive", value: "INACTIVE" }]} {...form.register("status")} />
          </div>
        </form>
      </Modal>

      {/* View Supplier Detail Modal */}
      <Modal
        open={Boolean(viewingSupplier)}
        title="Supplier Details"
        onClose={closeViewModal}
        footer={<Button variant="outline" onClick={closeViewModal}>Close</Button>}
      >
        {viewingSupplier && (
          <div className="space-y-4 text-sm text-secondary-700 dark:text-slate-300">
            <div className="flex items-center justify-between border-b border-secondary-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-secondary-900 dark:text-white">{viewingSupplier.name}</h3>
                <p className="text-xs text-secondary-500 dark:text-slate-400">ID: {viewingSupplier._id}</p>
              </div>
              <Badge color={viewingSupplier.status === "ACTIVE" ? "success" : "secondary"} dot>{viewingSupplier.status}</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-xs font-medium text-secondary-500 dark:text-slate-400">Contact Person</span>
                <span className="font-medium text-secondary-900 dark:text-white">{viewingSupplier.contactPerson ?? "-"}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-secondary-500 dark:text-slate-400">Phone</span>
                <span className="font-medium text-secondary-900 dark:text-white">{viewingSupplier.phone ?? "-"}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-secondary-500 dark:text-slate-400">Email</span>
                <span className="font-medium text-secondary-900 dark:text-white">{viewingSupplier.email ?? "-"}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-secondary-500 dark:text-slate-400">Delivery Lead Time</span>
                <span className="font-medium text-secondary-900 dark:text-white">{viewingSupplier.deliveryDays ? `${viewingSupplier.deliveryDays} days` : "-"}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-secondary-500 dark:text-slate-400">Rating</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={14} className="fill-warning-500 text-warning-500" />
                  <span className="font-semibold text-secondary-900 dark:text-white">{viewingSupplier.rating ?? "-"} / 5</span>
                </div>
              </div>
              <div>
                <span className="block text-xs font-medium text-secondary-500 dark:text-slate-400">Address</span>
                <span className="font-medium text-secondary-900 dark:text-white">{viewingSupplier.address ?? "-"}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Suppliers;
