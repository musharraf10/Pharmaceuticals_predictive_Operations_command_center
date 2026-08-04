import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit3, Factory, Plus, Trash2 } from "lucide-react";

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
import { useProduction } from "../../hooks/useProduction";
import { useProducts } from "../../hooks/useProducts";
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
    { header: "Actions", key: "actions", className: "text-right" },
];

const statusOptions = ["PLANNED", "IN_PROGRESS", "QUALITY_CHECK", "COMPLETED", "REJECTED"].map((value) => ({
    label: BATCH_STATUS[value].label,
    value,
}));

const defaults = {
    batchNumber: "",
    product: "",
    quantity: 1,
    manufacturedDate: "",
    expiryDate: "",
    status: "PLANNED",
    qualityScore: 100,
    productionLine: "Line 1",
    remarks: "",
};

const Production = () => {
    const {
        batches,
        isLoading,
        isError,
        createBatchAsync,
        updateBatchAsync,
        updateBatchStatusAsync,
        deleteBatchAsync,
        isCreating,
        isUpdating,
    } = useProduction();
    const { products } = useProducts();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const form = useForm({ defaultValues: defaults });

    const productOptions = useMemo(
        () => products.map((product) => ({ label: `${product.name} (${product.sku})`, value: product._id })),
        [products],
    );

    if (isLoading) return <Loader fullScreen />;

    if (isError) {
        return <EmptyState title="Unable to load production batches" description="Please refresh the page or try again later." />;
    }

    const inProgress = batches.filter((b) => b.status === "IN_PROGRESS").length;
    const completed = batches.filter((b) => b.status === "COMPLETED").length;
    const rejected = batches.filter((b) => b.status === "REJECTED").length;

    const openCreate = () => {
        setEditingBatch(null);
        form.reset(defaults);
        setModalOpen(true);
    };

    const openEdit = (batch) => {
        setEditingBatch(batch);
        form.reset({
            batchNumber: batch.batchNumber ?? "",
            product: batch.product?._id ?? batch.product ?? "",
            quantity: batch.quantity ?? 1,
            manufacturedDate: batch.manufacturedDate ? batch.manufacturedDate.slice(0, 10) : "",
            expiryDate: batch.expiryDate ? batch.expiryDate.slice(0, 10) : "",
            status: batch.status ?? "PLANNED",
            qualityScore: batch.qualityScore ?? 100,
            productionLine: batch.productionLine ?? "Line 1",
            remarks: batch.remarks ?? "",
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingBatch(null);
        form.reset(defaults);
    };

    const saveBatch = async (values) => {
        const payload = {
            ...values,
            quantity: Number(values.quantity),
            qualityScore: Number(values.qualityScore),
        };
        if (editingBatch) {
            await updateBatchAsync({ id: editingBatch._id, payload });
        } else {
            await createBatchAsync(payload);
        }
        closeModal();
    };

    return (
        <PageContainer>
            <PageHeader title="Production" subtitle="Manufacturing batches and quality control" action={<Button icon={Plus} onClick={openCreate}>New Batch</Button>} />

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
                        <TableCell><code className="rounded-md bg-secondary-100 px-2.5 py-1 text-xs font-semibold text-secondary-800 tracking-wide">{batch.batchNumber}</code></TableCell>
                        <TableCell className="font-semibold text-secondary-900">{batch.product?.name ?? "-"}</TableCell>
                        <TableCell className="font-semibold text-secondary-900">{batch.quantity}</TableCell>
                        <TableCell className="text-secondary-600">{batch.productionLine}</TableCell>
                        <TableCell>
                            <span className="inline-flex items-center rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-bold text-success-700">
                                {batch.qualityScore}%
                            </span>
                        </TableCell>
                        <TableCell className="w-48">
                            <select
                                value={batch.status}
                                onChange={(e) => updateBatchStatusAsync({ id: batch._id, payload: { status: e.target.value } })}
                                className="w-full cursor-pointer rounded-xl border border-secondary-200 dark:border-slate-700 bg-secondary-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-secondary-800 dark:text-white transition hover:border-primary-400 focus:border-primary-600 focus:outline-none"
                            >
                                {statusOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </TableCell>
                        <TableCell className="text-secondary-500">{formatDate(batch.expiryDate)}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end gap-1.5">
                                <Button size="sm" variant="outline" icon={Edit3} onClick={() => openEdit(batch)}>Edit</Button>
                                <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deleteBatchAsync(batch._id)}>Delete</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            />

            <Modal
                open={modalOpen}
                title={editingBatch ? "Edit Batch" : "New Batch"}
                onClose={closeModal}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={closeModal}>Cancel</Button>
                        <Button type="submit" form="batch-form" loading={isCreating || isUpdating}>{editingBatch ? "Save Changes" : "Create Batch"}</Button>
                    </>
                }
            >
                <form id="batch-form" onSubmit={form.handleSubmit(saveBatch)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="Batch Number" error={form.formState.errors.batchNumber?.message} {...form.register("batchNumber", { required: "Batch number is required" })} />
                        <Select label="Product" placeholder="Choose product" options={productOptions} error={form.formState.errors.product?.message} {...form.register("product", { required: "Product is required" })} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Input label="Quantity" type="number" min="1" {...form.register("quantity", { required: "Quantity is required" })} />
                        <Input label="Manufactured Date" type="date" {...form.register("manufacturedDate", { required: "Manufactured date is required" })} />
                        <Input label="Expiry Date" type="date" {...form.register("expiryDate", { required: "Expiry date is required" })} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Select label="Status" options={statusOptions} {...form.register("status")} />
                        <Input label="Quality Score" type="number" min="0" max="100" {...form.register("qualityScore")} />
                        <Input label="Production Line" {...form.register("productionLine")} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary-700 dark:text-secondary-200">
                            Remarks
                        </label>

                        <textarea
                            rows={3}
                            className="
      w-full
      rounded-xl
      border
      border-secondary-300
      bg-white
      px-4
      py-2.5
      text-[15px]
      text-secondary-900
      placeholder:text-secondary-400
      focus:border-primary-600
      focus:ring-2
      focus:ring-primary-100

      dark:border-secondary-700
      dark:bg-secondary-800
      dark:text-white
      dark:placeholder:text-secondary-400
      dark:focus:border-primary-500
      dark:focus:ring-primary-900
    "
                            {...form.register("remarks")}
                        />
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
};

export default Production;
