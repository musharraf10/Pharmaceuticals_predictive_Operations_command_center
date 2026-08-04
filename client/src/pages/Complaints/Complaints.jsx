import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertTriangle, CheckCircle2, Edit3, MessageSquareWarning, Plus, ShieldAlert, Trash2 } from "lucide-react";

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
import { useComplaints } from "../../hooks/useComplaints";
import { useProducts } from "../../hooks/useProducts";
import { formatDate } from "../../utils/formatDate";
import { COMPLAINT_STATUS, SEVERITY } from "../../utils/statusConfig";

const columns = [
  { header: "Complaint", key: "title", sortable: true, sortKey: "title" },
  { header: "Product", key: "product", sortable: true, sortKey: "product.name" },
  { header: "Reported By", key: "reportedBy", sortable: true, sortKey: "reportedBy" },
  { header: "Severity", key: "severity", sortable: true, sortKey: "severity" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
  { header: "Reported", key: "createdAt", sortable: true, sortKey: "createdAt" },
  { header: "Actions", key: "actions", className: "text-right" },
];

const severityOptions = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((value) => ({
  label: SEVERITY[value].label,
  value,
}));

const statusOptions = ["OPEN", "UNDER_REVIEW", "RESOLVED", "CLOSED"].map((value) => ({
  label: COMPLAINT_STATUS[value].label,
  value,
}));

const Complaints = () => {
  const {
    complaints,
    isLoading,
    isError,
    createComplaintAsync,
    updateComplaintAsync,
    deleteComplaintAsync,
    isCreating,
    isUpdating,
  } = useComplaints();
  const { products } = useProducts();
  const [modal, setModal] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const productOptions = useMemo(
    () => products.map((product) => ({ label: `${product.name} (${product.sku})`, value: product._id })),
    [products],
  );

  const complaintForm = useForm({
    defaultValues: { title: "", description: "", product: "", reportedBy: "", severity: "LOW", status: "OPEN", resolution: "" },
  });

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load complaints"
        description="Please refresh the page or try again later."
      />
    );
  }

  const open = complaints.filter((complaint) => complaint.status !== "CLOSED").length;
  const critical = complaints.filter((complaint) => complaint.severity === "CRITICAL").length;
  const resolved = complaints.filter((complaint) => ["RESOLVED", "CLOSED"].includes(complaint.status)).length;

  const closeModal = () => {
    setModal(null);
    setSelectedComplaint(null);
    complaintForm.reset();
  };

  const openCreate = () => {
    setSelectedComplaint(null);
    complaintForm.reset({ title: "", description: "", product: "", reportedBy: "", severity: "LOW", status: "OPEN", resolution: "" });
    setModal("create");
  };

  const openEdit = (complaint) => {
    setSelectedComplaint(complaint);
    complaintForm.reset({
      title: complaint.title ?? "",
      description: complaint.description ?? "",
      product: complaint.product?._id ?? complaint.product ?? "",
      reportedBy: complaint.reportedBy ?? "",
      severity: complaint.severity ?? "LOW",
      status: complaint.status ?? "OPEN",
      resolution: complaint.resolution ?? "",
    });
    setModal("edit");
  };

  const saveComplaint = async (values) => {
    if (selectedComplaint) {
      await updateComplaintAsync({ id: selectedComplaint._id, payload: values });
    } else {
      await createComplaintAsync({
        title: values.title,
        description: values.description,
        product: values.product,
        reportedBy: values.reportedBy,
        severity: values.severity,
      });
    }
    closeModal();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Complaints"
        subtitle="Quality signals, severity triage, and resolution tracking"
        action={<Button icon={Plus} onClick={openCreate}>New Complaint</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Complaints" value={complaints.length} icon={MessageSquareWarning} color="primary" />
        <KPICard title="Open Cases" value={open} icon={AlertTriangle} color="warning" />
        <KPICard title="Critical" value={critical} icon={ShieldAlert} color="danger" />
        <KPICard title="Resolved" value={resolved} icon={CheckCircle2} color="success" />
      </div>

      <DataTable
        data={complaints}
        columns={columns}
        searchKeys={["title", "description", "product.name", "reportedBy", "severity", "status"]}
        searchPlaceholder="Search complaints..."
        emptyTitle="No complaints found"
        emptyDescription="Quality complaints and corrective actions will appear here."
        renderRow={(complaint) => (
          <TableRow key={complaint._id}>
            <TableCell>
              <div>
                <p className="font-semibold text-secondary-900 dark:text-white">{complaint.title}</p>
                {complaint.resolution && (
                  <p className="mt-1 max-w-sm truncate text-[13px] text-secondary-500 dark:text-slate-300">
                    Resolution: {complaint.resolution}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell><span className="font-medium text-secondary-800 dark:text-slate-200">{complaint.product?.name ?? "Unavailable"}</span></TableCell>
            <TableCell className="text-secondary-600 dark:text-slate-300">{complaint.reportedBy}</TableCell>
            <TableCell>
              <StatusBadge statusMap={SEVERITY} status={complaint.severity} />
            </TableCell>
            <TableCell>
              <StatusBadge statusMap={COMPLAINT_STATUS} status={complaint.status} />
            </TableCell>
            <TableCell className="text-secondary-500 dark:text-slate-300">{formatDate(complaint.createdAt)}</TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <Button size="sm" variant="outline" icon={Edit3} onClick={() => openEdit(complaint)}>Edit</Button>
                <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deleteComplaintAsync(complaint._id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modal === "create" || modal === "edit"}
        title={selectedComplaint ? "Edit Complaint Details" : "Create New Complaint"}
        onClose={closeModal}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="complaint-form" loading={isCreating || isUpdating}>
              {selectedComplaint ? "Save Changes" : "Submit Complaint"}
            </Button>
          </>
        }
      >
        <form id="complaint-form" onSubmit={complaintForm.handleSubmit(saveComplaint)} className="space-y-4">
          <Input
            label="Complaint Title"
            error={complaintForm.formState.errors.title?.message}
            {...complaintForm.register("title", { required: "Title is required" })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Affected Product"
              placeholder="Choose product"
              options={productOptions}
              error={complaintForm.formState.errors.product?.message}
              {...complaintForm.register("product", { required: "Product is required" })}
            />
            <Select label="Severity Level" options={severityOptions} {...complaintForm.register("severity")} />
          </div>
          <Input
            label="Reported By (Person / Facility)"
            error={complaintForm.formState.errors.reportedBy?.message}
            {...complaintForm.register("reportedBy", { required: "Reporter is required" })}
          />
          {selectedComplaint && (
            <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-secondary-200 dark:border-slate-800 bg-secondary-50 dark:bg-slate-800/80 p-4">
              <Select label="Resolution Status" options={statusOptions} {...complaintForm.register("status")} />
              <Input label="Resolution / Corrective Action Notes" placeholder="Detail action taken..." {...complaintForm.register("resolution")} />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700 dark:text-slate-300">Detailed Complaint Description</label>
            <textarea
              rows={4}
              placeholder="Provide context, batch details, or quality observation..."
              className="w-full rounded-xl border border-secondary-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-[15px] text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-slate-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              {...complaintForm.register("description", { required: "Description is required" })}
            />
            {complaintForm.formState.errors.description && (
              <p className="text-sm text-danger-600">{complaintForm.formState.errors.description.message}</p>
            )}
          </div>
        </form>
      </Modal>

    </PageContainer>
  );
};

export default Complaints;
