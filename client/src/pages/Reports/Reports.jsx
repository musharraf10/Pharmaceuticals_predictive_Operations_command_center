import { AlertTriangle, Boxes, ClipboardList, Download, Factory, FileBarChart2, Package, ShoppingCart, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Card, { CardHeader } from "../../components/ui/Card";
import ChartCard from "../../components/ui/ChartCard";
import EmptyState from "../../components/ui/EmptyState";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import { useReports } from "../../hooks/useReports";
import { exportCsv } from "../../utils/exportCsv";
import { formatDateTime } from "../../utils/formatDate";
import { COMPLAINT_STATUS, INVENTORY_STATUS, TASK_STATUS } from "../../utils/statusConfig";

import { useLayout } from "../../hooks/useLayout";

const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6"];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-dropdown text-secondary-900 dark:text-white">
      <p className="mb-1 text-[13px] font-medium text-secondary-500 dark:text-slate-400">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold text-secondary-900 dark:text-white">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const countBy = (items = [], key) =>
  items.reduce((acc, item) => {
    const value = item?.[key] ?? "UNKNOWN";
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

const toChartData = (counts) =>
  Object.entries(counts).map(([name, value]) => ({ name, value }));

const Reports = () => {
  const reports = useReports();
  const { theme } = useLayout();

  const isDark = theme === "dark";
  const gridColor = isDark ? "#334155" : "#E2E8F0";
  const tickColor = isDark ? "#CBD5E1" : "#64748B";

  const loading = Object.values(reports).some((report) => report.isLoading);
  const error = Object.values(reports).some((report) => report.isError);

  if (loading) return <Loader fullScreen />;

  if (error) {
    return (
      <EmptyState
        title="Unable to load reports"
        description="Please refresh the page or try again later."
      />
    );
  }

  const summary = reports.summary.report;
  const inventory = reports.inventory.report ?? [];
  const orders = reports.orders.report ?? [];
  const production = reports.production.report ?? [];
  const forecasts = reports.forecast.report ?? [];
  const complaints = reports.complaints.report ?? [];
  const tasks = reports.tasks.report ?? [];

  if (!summary) {
    return (
      <EmptyState
        title="No report data"
        description="Report data will appear here once operations are active."
      />
    );
  }

  const overview = summary.overview ?? {};
  const inventoryHealth = toChartData(countBy(inventory, "status"));
  const orderPipeline = toChartData(countBy(orders, "status"));
  const taskMix = toChartData(countBy(tasks, "status"));
  const forecastRisk = toChartData(countBy(forecasts, "riskLevel"));

  const reportCards = [
    { title: "Products", value: overview.totalProducts, icon: Package, color: "primary" },
    { title: "Inventory", value: overview.totalInventoryItems, icon: Boxes, color: "success" },
    { title: "Orders", value: overview.totalOrders, icon: ShoppingCart, color: "warning" },
    { title: "Production", value: overview.totalProductionBatches, icon: Factory, color: "info" },
    { title: "Forecasts", value: overview.totalForecasts, icon: TrendingUp, color: "primary" },
    { title: "Complaints", value: overview.totalComplaints, icon: AlertTriangle, color: "danger" },
    { title: "Tasks", value: overview.totalTasks, icon: ClipboardList, color: "secondary" },
  ];

  const exportReports = () => {
    const rows = [
      ...Object.entries(overview || {}).map(([metric, value]) => ({ section: "Overview", metric, value })),
      ...(inventory || []).map((item) => ({ section: "Inventory", metric: item.product?.name ?? item._id, value: `Qty: ${item.quantity} | Status: ${item.status}` })),
      ...(orders || []).map((order) => ({ section: "Orders", metric: order.customerName, value: `Qty: ${order.quantity} | Status: ${order.status}` })),
      ...(production || []).map((batch) => ({ section: "Production", metric: batch.batchNumber, value: `Qty: ${batch.quantity} | Status: ${batch.status}` })),
      ...(forecasts || []).map((forecast) => ({ section: "Forecast", metric: forecast.product?.name ?? forecast._id, value: `Demand: ${forecast.predictedDemand} | Risk: ${forecast.riskLevel}` })),
      ...(complaints || []).map((complaint) => ({ section: "Complaints", metric: complaint.title, value: `Severity: ${complaint.severity} | Status: ${complaint.status}` })),
      ...(tasks || []).map((task) => ({ section: "Tasks", metric: task.title, value: `Priority: ${task.priority} | Status: ${task.status}` })),
    ];

    exportCsv("operations-full-report.csv", rows, [
      { header: "Module / Section", key: "section" },
      { header: "Item / Metric Name", key: "metric" },
      { header: "Report Value / Status", key: "value" },
    ]);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        subtitle={`Operational reporting generated ${formatDateTime(summary.generatedAt)}`}
        action={<Button variant="outline" icon={Download} onClick={exportReports}>Export View</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {reportCards.slice(0, 4).map((card) => (
          <KPICard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {reportCards.slice(4).map((card) => (
          <KPICard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Order Pipeline" subtitle="Fulfillment state across reported orders">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderPipeline} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Orders" radius={[6, 6, 0, 0]}>
                {orderPipeline.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory Health" subtitle="Stock status distribution from inventory report">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={inventoryHealth} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={4}>
                {inventoryHealth.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Operational Exceptions"
            subtitle="The highest-priority items from live reports"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {inventory.filter((item) => item.status !== "AVAILABLE").slice(0, 4).map((item) => (
              <div key={item._id} className="rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white">{item.product?.name ?? "Inventory item"}</p>
                    <p className="mt-1 text-[13px] text-secondary-500 dark:text-slate-300">
                      {item.warehouse} - Qty {item.quantity}
                    </p>
                  </div>
                  <StatusBadge statusMap={INVENTORY_STATUS} status={item.status} />
                </div>
              </div>
            ))}
            {complaints.filter((item) => item.status !== "CLOSED").slice(0, 4).map((item) => (
              <div key={item._id} className="rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white">{item.title}</p>
                    <p className="mt-1 text-[13px] text-secondary-500 dark:text-slate-300">{item.product?.name ?? "Product"} complaint</p>
                  </div>
                  <StatusBadge statusMap={COMPLAINT_STATUS} status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Report Coverage" subtitle="Available API-backed report streams" />
          <div className="space-y-3">
            {[
              ["Inventory", inventory.length],
              ["Orders", orders.length],
              ["Production", production.length],
              ["Forecast", forecasts.length],
              ["Complaints", complaints.length],
              ["Tasks", tasks.length],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-secondary-50 dark:bg-slate-800/80 px-4 py-3">
                <span className="text-[15px] font-medium text-secondary-700 dark:text-slate-200">{label}</span>
                <span className="text-lg font-bold text-secondary-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Task Status" subtitle="Execution load by state" />
          <div className="space-y-3">
            {taskMix.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3">
                <StatusBadge statusMap={TASK_STATUS} status={item.name} />
                <span className="font-bold text-secondary-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Forecast Risk" subtitle="Risk posture from AI forecast reports" />
          <div className="space-y-3">
            {forecastRisk.length > 0 ? (
              forecastRisk.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3 rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="flex-1 text-[15px] font-medium text-secondary-700 dark:text-slate-200">{item.name}</span>
                  <span className="font-bold text-secondary-900 dark:text-white">{item.value}</span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-secondary-300 dark:border-slate-800 p-8 text-center">
                <FileBarChart2 className="mx-auto text-secondary-400 dark:text-slate-400" size={28} />
                <p className="mt-3 text-[15px] text-secondary-500 dark:text-slate-400">Forecast risk data will appear after a forecast run.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Reports;
