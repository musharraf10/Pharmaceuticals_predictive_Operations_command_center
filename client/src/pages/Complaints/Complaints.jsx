import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertTriangle, CheckCircle2, MessageSquareWarning, MoreHorizontal, Plus, ShieldAlert } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import Dropdown, { DropdownDivider, DropdownItem } from "../../components/ui/Dropdown";
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
  { header: "", key: "actions" },
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
    updateComplaintStatusAsync,
    deleteComplaintAsync,
    isCreating,
    isUpdating,
    isUpdatingStatus,
  } = useComplaints();
  const { products } = useProducts();
  const [modal, setModal] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const productOptions = useMemo(
    () => products.map((product) => ({ label: `${product.name} (${product.sku})`, value: product._id })),
    [products],
  );

  const complaintForm = useForm({
    defaultValues: { title: "", description: "", product: "", reportedBy: "", severity: "LOW" },
  });
  const resolutionForm = useForm({ defaultValues: { status: "RESOLVED", resolution: "" } });

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
    resolutionForm.reset();
  };

  const createComplaint = async (values) => {
    await createComplaintAsync(values);
    closeModal();
  };

  const openResolution = (complaint) => {
    setSelectedComplaint(complaint);
    resolutionForm.reset({
      status: complaint.status ?? "RESOLVED",
      resolution: complaint.resolution ?? "",
    });
    setModal("resolution");
  };

  const saveResolution = async (values) => {
    await updateComplaintAsync({
      id: selectedComplaint._id,
      payload: {
        status: values.status,
        resolution: values.resolution,
      },
    });
    if (values.status !== selectedComplaint.status) {
      await updateComplaintStatusAsync({
        id: selectedComplaint._id,
        payload: { status: values.status },
      });
    }
    closeModal();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Complaints"
        subtitle="Quality signals, severity triage, and resolution tracking"
        action={<Button icon={Plus} onClick={() => setModal("create")}>New Complaint</Button>}
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
                <p className="font-medium text-secondary-900">{complaint.title}</p>
                {complaint.resolution && (
                  <p className="mt-1 max-w-sm truncate text-[13px] text-secondary-500">
                    Resolution: {complaint.resolution}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell>{complaint.product?.name ?? "Unavailable"}</TableCell>
            <TableCell className="text-secondary-500">{complaint.reportedBy}</TableCell>
            <TableCell>
              <StatusBadge statusMap={SEVERITY} status={complaint.severity} />
            </TableCell>
            <TableCell>
              <StatusBadge statusMap={COMPLAINT_STATUS} status={complaint.status} />
            </TableCell>
            <TableCell className="text-secondary-500">{formatDate(complaint.createdAt)}</TableCell>
            <TableCell>
              <Dropdown
                trigger={
                  <button className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600">
                    <MoreHorizontal size={18} />
                  </button>
                }
              >
                <DropdownItem onClick={() => openResolution(complaint)}>Update Resolution</DropdownItem>
                <DropdownDivider />
                <DropdownItem danger onClick={() => deleteComplaintAsync(complaint._id)}>
                  Delete Complaint
                </DropdownItem>
              </Dropdown>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modal === "create"}
        title="Create Complaint"
        onClose={closeModal}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="complaint-form" loading={isCreating}>Submit Complaint</Button>
          </>
        }
      >
        <form id="complaint-form" onSubmit={complaintForm.handleSubmit(createComplaint)} className="space-y-4">
          <Input
            label="Complaint Title"
            error={complaintForm.formState.errors.title?.message}
            {...complaintForm.register("title", { required: "Title is required" })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Product"
              placeholder="Choose product"
              options={productOptions}
              error={complaintForm.formState.errors.product?.message}
              {...complaintForm.register("product", { required: "Product is required" })}
            />
            <Select label="Severity" options={severityOptions} {...complaintForm.register("severity")} />
          </div>
          <Input
            label="Reported By"
            error={complaintForm.formState.errors.reportedBy?.message}
            {...complaintForm.register("reportedBy", { required: "Reporter is required" })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Description</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-[15px] focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              {...complaintForm.register("description", { required: "Description is required" })}
            />
            {complaintForm.formState.errors.description && (
              <p className="text-sm text-danger-600">{complaintForm.formState.errors.description.message}</p>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        open={modal === "resolution"}
        title={`Resolve ${selectedComplaint?.title ?? "Complaint"}`}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="resolution-form" loading={isUpdating || isUpdatingStatus}>Save</Button>
          </>
        }
      >
        <form id="resolution-form" onSubmit={resolutionForm.handleSubmit(saveResolution)} className="space-y-4">
          <Select label="Status" options={statusOptions} {...resolutionForm.register("status")} />
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Resolution</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-[15px] focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              {...resolutionForm.register("resolution")}
            />
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Complaints;
