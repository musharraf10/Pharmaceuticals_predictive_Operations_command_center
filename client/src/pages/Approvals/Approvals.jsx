import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, ClipboardCheck, FileCheck2, Plus, RotateCcw, Trash2, XCircle } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Card, { CardHeader } from "../../components/ui/Card";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
import { useApprovals } from "../../hooks/useApprovals";
import { useForecast } from "../../hooks/useForecast";
import { formatDate } from "../../utils/formatDate";
import { APPROVAL_STATUS, RISK_LEVEL } from "../../utils/statusConfig";

const columns = [
  { header: "Forecast", key: "forecast", sortable: true, sortKey: "forecast.product.name" },
  { header: "Decision", key: "decision", sortable: true, sortKey: "decision" },
  { header: "Reviewer", key: "reviewer", sortable: true, sortKey: "reviewer.name" },
  { header: "Reason", key: "reason" },
  { header: "Reviewed", key: "approvedAt", sortable: true, sortKey: "approvedAt" },
  { header: "Actions", key: "actions", className: "text-right" },
];

const decisionOptions = ["APPROVED", "REJECTED", "OVERRIDDEN"].map((value) => ({
  label: APPROVAL_STATUS[value].label,
  value,
}));

const Approvals = () => {
  const {
    approvals,
    isLoading,
    isError,
    createApprovalAsync,
    deleteApprovalAsync,
    isCreating,
  } = useApprovals();
  const { forecasts, isLoading: forecastsLoading } = useForecast();
  const [modalOpen, setModalOpen] = useState(false);

  const approvalForm = useForm({
    defaultValues: { forecast: "", decision: "APPROVED", reason: "" },
  });

  const reviewedForecastIds = useMemo(
    () => new Set(approvals.map((approval) => approval.forecast?._id ?? approval.forecast)),
    [approvals],
  );

  const forecastOptions = useMemo(
    () =>
      forecasts
        .filter((forecast) => !reviewedForecastIds.has(forecast._id))
        .map((forecast) => ({
          label: `${forecast.product?.name ?? "Product"} - ${forecast.predictedDemand} units - ${forecast.riskLevel} risk`,
          value: forecast._id,
        })),
    [forecasts, reviewedForecastIds],
  );

  if (isLoading || forecastsLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load approvals"
        description="Please refresh the page or try again later."
      />
    );
  }

  const approved = approvals.filter((approval) => approval.decision === "APPROVED").length;
  const rejected = approvals.filter((approval) => approval.decision === "REJECTED").length;
  const overridden = approvals.filter((approval) => approval.decision === "OVERRIDDEN").length;
  const pending = Math.max(0, forecasts.length - approvals.length);

  const closeModal = () => {
    setModalOpen(false);
    approvalForm.reset();
  };

  const createApproval = async (values) => {
    await createApprovalAsync(values);
    closeModal();
  };

  const decideForecast = async (forecast, decision) => {
    await createApprovalAsync({
      forecast: forecast._id,
      decision,
      reason: `${APPROVAL_STATUS[decision].label} from forecast review queue.`,
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Approvals"
        subtitle="Forecast governance, review decisions, and exception overrides"
        action={<Button icon={Plus} onClick={() => setModalOpen(true)}>Record Decision</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Pending Review" value={pending} icon={ClipboardCheck} color="warning" />
        <KPICard title="Approved" value={approved} icon={CheckCircle2} color="success" />
        <KPICard title="Rejected" value={rejected} icon={XCircle} color="danger" />
        <KPICard title="Overridden" value={overridden} icon={RotateCcw} color="info" />
      </div>

      {forecasts.filter((forecast) => !reviewedForecastIds.has(forecast._id)).length > 0 && (
        <Card>
          <CardHeader
            title="Forecasts Awaiting Review"
            subtitle="High-signal forecasts that still need a manager decision"
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {forecasts
              .filter((forecast) => !reviewedForecastIds.has(forecast._id))
              .slice(0, 6)
              .map((forecast) => (
                <div key={forecast._id} className="rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-secondary-900 dark:text-white">{forecast.product?.name ?? "Product"}</p>
                      <p className="mt-1 text-[13px] text-secondary-500 dark:text-slate-300">{forecast.predictedDemand} predicted units</p>
                    </div>
                    <StatusBadge statusMap={RISK_LEVEL} status={forecast.riskLevel} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-[13px] text-secondary-500 dark:text-slate-300">
                    {forecast.recommendation || forecast.explanation || "Review forecast confidence and operational risk before approval."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="success" icon={CheckCircle2} loading={isCreating} onClick={() => decideForecast(forecast, "APPROVED")}>Approve</Button>
                    <Button size="sm" variant="outline" icon={XCircle} loading={isCreating} onClick={() => decideForecast(forecast, "REJECTED")}>Reject</Button>
                    <Button size="sm" variant="secondary" icon={RotateCcw} loading={isCreating} onClick={() => decideForecast(forecast, "OVERRIDDEN")}>Override</Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      <DataTable
        data={approvals}
        columns={columns}
        searchKeys={["forecast.product.name", "decision", "reviewer.name", "reason"]}
        searchPlaceholder="Search approvals..."
        emptyTitle="No decisions recorded"
        emptyDescription="Approved, rejected, and overridden forecasts will appear here."
        renderRow={(approval) => (
          <TableRow key={approval._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/40">
                  <FileCheck2 size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-secondary-900 dark:text-white">
                    {approval.forecast?.product?.name ?? "Forecast"}
                  </p>
                  <p className="text-[13px] text-secondary-500 dark:text-slate-300">
                    Demand {approval.forecast?.predictedDemand ?? "-"} units
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge statusMap={APPROVAL_STATUS} status={approval.decision} />
            </TableCell>
            <TableCell className="text-secondary-500 dark:text-slate-300">
              {approval.reviewer?.name ?? "System"}
            </TableCell>
            <TableCell className="max-w-sm truncate text-secondary-500 dark:text-slate-300">
              {approval.reason || "No reason provided"}
            </TableCell>
            <TableCell className="text-secondary-500 dark:text-slate-300">{formatDate(approval.approvedAt)}</TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deleteApprovalAsync(approval._id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modalOpen}
        title="Record Forecast Decision"
        onClose={closeModal}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="approval-form" loading={isCreating}>Record Decision</Button>
          </>
        }
      >
        <form id="approval-form" onSubmit={approvalForm.handleSubmit(createApproval)} className="space-y-4">
          <Select
            label="Forecast"
            placeholder={forecastOptions.length ? "Choose forecast" : "No pending forecasts"}
            options={forecastOptions}
            error={approvalForm.formState.errors.forecast?.message}
            {...approvalForm.register("forecast", { required: "Forecast is required" })}
          />
          <Select label="Decision" options={decisionOptions} {...approvalForm.register("decision")} />
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700 dark:text-slate-300">Reason</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-secondary-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-[15px] text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-slate-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              {...approvalForm.register("reason")}
            />
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Approvals;
