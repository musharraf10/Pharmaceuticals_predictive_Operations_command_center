import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Factory,
  Package,
  ShoppingCart,
  Sliders,
  Sparkles,
  TrendingUp,
  Truck,
} from "lucide-react";
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
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card, { CardHeader } from "../../components/ui/Card";
import ChartCard from "../../components/ui/ChartCard";
import EmptyState from "../../components/ui/EmptyState";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import NotificationCard from "../../components/ui/NotificationCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { useDashboard } from "../../hooks/useDashboard";
import { useLayout } from "../../hooks/useLayout";
import { exportCsv } from "../../utils/exportCsv";
import { formatRelativeTime } from "../../utils/formatDate";
import { ORDER_STATUS } from "../../utils/statusConfig";

import DemandForecastChart from "../../components/dashboard/DemandForecastChart";
import WorkloadForecastChart from "../../components/dashboard/WorkloadForecastChart";
import ProductionHeatMap from "../../components/dashboard/ProductionHeatMap";
import RiskDrillDownModal from "../../components/dashboard/RiskDrillDownModal";
import AlertThresholdsModal from "../../components/dashboard/AlertThresholdsModal";

const DEFAULT_THRESHOLDS = {
  lowStockLimit: 50,
  highDemandMultiplier: 1.5,
  maxLineCapacity: 6,
  maxComplaintThreshold: 3,
};

const CHART_COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

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

const Dashboard = () => {
  const { dashboard, isLoading, isError } = useDashboard();
  const { theme } = useLayout();

  const [thresholds, setThresholds] = useState(() => {
    try {
      const saved = localStorage.getItem("pharma_alert_thresholds");
      return saved ? JSON.parse(saved) : DEFAULT_THRESHOLDS;
    } catch {
      return DEFAULT_THRESHOLDS;
    }
  });

  const handleSaveThresholds = (newThresholds) => {
    setThresholds(newThresholds);
    try {
      localStorage.setItem("pharma_alert_thresholds", JSON.stringify(newThresholds));
    } catch (e) {
      console.error("Failed to save thresholds", e);
    }
  };

  const [thresholdsModalOpen, setThresholdsModalOpen] = useState(false);
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [selectedRiskCategory, setSelectedRiskCategory] = useState("ALL");

  const isDark = theme === "dark";
  const gridColor = isDark ? "#334155" : "#E2E8F0";
  const tickColor = isDark ? "#CBD5E1" : "#64748B";

  const demandForecastData = dashboard?.demandForecastData ?? [];
  const workloadForecastData = dashboard?.workloadForecastData ?? [];
  const productionCapacityData = dashboard?.productionCapacityData ?? [];
  const riskItems = dashboard?.riskItems ?? [];
  const kpis = dashboard?.kpis ?? {};
  const liveQueue = dashboard?.liveQueue ?? [];
  const recentActivities = dashboard?.recentActivities ?? [];
  const notifications = dashboard?.notifications ?? [];

  // Real Data Analytics recalculated dynamically based on active Thresholds
  const activeDemandForecastData = useMemo(() => {
    return demandForecastData.map((item) => {
      const mult = thresholds.highDemandMultiplier || 1.5;
      const lowLimit = thresholds.lowStockLimit || 50;
      const isAnomaly =
        item.predictedDemand > item.currentStock * mult ||
        (item.currentStock < lowLimit && item.predictedDemand > 0) ||
        item.confidence < 75;

      return {
        ...item,
        isAnomaly,
        anomalyReason: isAnomaly
          ? item.predictedDemand > item.currentStock * mult
            ? `Demand exceeds stock by >${Math.round((mult - 1) * 100)}%`
            : item.currentStock < lowLimit
            ? `Stock (${item.currentStock}) below threshold (${lowLimit})`
            : "Low prediction confidence"
          : null,
      };
    });
  }, [demandForecastData, thresholds]);

  const activeProductionCapacityData = useMemo(() => {
    return productionCapacityData.map((item) => {
      const maxCap = thresholds.maxLineCapacity || 6;
      const utilizationPercent = Math.min(Math.round((item.activeBatches / maxCap) * 100), 100);

      let capacityStatus = "OPTIMAL";
      if (utilizationPercent < 30) capacityStatus = "LOW";
      else if (utilizationPercent >= 85 || item.activeBatches >= maxCap) capacityStatus = "OVERLOADED";
      else if (utilizationPercent >= 60) capacityStatus = "HIGH";

      return {
        ...item,
        maxCapacity: maxCap,
        utilizationPercent,
        capacityStatus,
      };
    });
  }, [productionCapacityData, thresholds]);

  const activeRiskItems = useMemo(() => {
    const items = [...riskItems];
    if (kpis.openComplaints >= thresholds.maxComplaintThreshold) {
      items.push({
        id: "cmp-thresh-alert",
        category: "COMPLAINT",
        title: "Quality Complaint Threshold Exceeded",
        severity: "HIGH",
        currentValue: `${kpis.openComplaints} open complaints`,
        thresholdValue: `${thresholds.maxComplaintThreshold} max threshold`,
        description: `Total open complaints (${kpis.openComplaints}) equal or exceed configured limit (${thresholds.maxComplaintThreshold}).`,
        actionPath: "/complaints",
      });
    }
    return items;
  }, [riskItems, kpis.openComplaints, thresholds]);

  const handleOpenRiskModal = (category = "ALL") => {
    setSelectedRiskCategory(category);
    setRiskModalOpen(true);
  };

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description="Please refresh the page or try again later."
      />
    );
  }

  if (!dashboard) {
    return (
      <EmptyState
        title="No dashboard data"
        description="Dashboard metrics will appear here once available."
      />
    );
  }

  const exportDashboard = () => {
    const kpiRows = Object.entries(kpis || {}).map(([metric, value]) => ({
      category: "KPI Metric",
      item: metric,
      details: String(value),
    }));
    const orderRows = (liveQueue || []).map((o) => ({
      category: "Live Queue",
      item: o.product?.name ?? "Product",
      details: `Customer: ${o.customerName} | Qty: ${o.quantity} | Status: ${o.status}`,
    }));
    const activityRows = (recentActivities || []).map((a) => ({
      category: "Recent Activity",
      item: a.user?.name ?? "System",
      details: `Action: ${a.action} | Entity: ${a.entity ?? "-"}`,
    }));

    exportCsv(
      "dashboard-operations-report.csv",
      [...kpiRows, ...orderRows, ...activityRows],
      [
        { header: "Category", key: "category" },
        { header: "Item / Metric", key: "item" },
        { header: "Details / Value", key: "details" },
      ],
    );
  };

  const orderPipelineData = [
    { name: "Pending", value: kpis.pendingOrders },
    { name: "Processing", value: kpis.processingOrders },
    { name: "Dispatched", value: kpis.dispatchedOrders },
    { name: "Delivered", value: kpis.deliveredOrders },
  ];

  const inventoryHealthData = [
    {
      name: "Available",
      value: Math.max(
        0,
        kpis.totalInventoryItems - kpis.lowStock - kpis.outOfStock,
      ),
    },
    { name: "Low Stock", value: kpis.lowStock },
    { name: "Out of Stock", value: kpis.outOfStock },
  ];

  const aiRecommendations = [
    kpis.lowStock > 0 && {
      title: "Restock low inventory items",
      description: `${kpis.lowStock} SKUs are below reorder threshold. Initiate procurement to prevent stockouts.`,
      priority: "high",
      link: "/inventory",
    },
    kpis.openComplaints > 0 && {
      title: "Review open quality complaints",
      description: `${kpis.openComplaints} complaints require attention. Prioritize critical severity cases.`,
      priority: "medium",
      link: "/complaints",
    },
    kpis.highPriorityTasks > 0 && {
      title: "High-priority tasks pending",
      description: `${kpis.highPriorityTasks} urgent tasks are awaiting action across operations teams.`,
      priority: "high",
      link: "/tasks",
    },
    {
      title: "Run AI demand forecast",
      description: `${kpis.totalForecasts} forecasts generated. Review predictions and approve procurement plans.`,
      priority: "info",
      link: "/forecast",
    },
  ].filter(Boolean);

  const quickActions = [
    { label: "New Order", icon: ShoppingCart, path: "/orders" },
    { label: "Run Forecast", icon: BrainCircuit, path: "/forecast" },
    { label: "View Inventory", icon: Boxes, path: "/inventory" },
    { label: "Production", icon: Factory, path: "/production" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Operations Command Center"
        subtitle="Real-time supply chain intelligence and predictive insights"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              icon={Sliders}
              onClick={() => setThresholdsModalOpen(true)}
            >
              Alert Thresholds
            </Button>
            <Button variant="outline" icon={TrendingUp} onClick={exportDashboard}>
              Export Report
            </Button>
          </div>
        }
      />

      {/* KPI Grid with Clickable Risk Drill-Down Handlers */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total Products"
          value={kpis.totalProducts}
          subtitle="Active catalog SKUs"
          icon={Package}
          color="primary"
        />
        <div onClick={() => handleOpenRiskModal("INVENTORY")} className="h-full flex flex-col cursor-pointer">
          <KPICard
            title="Inventory Items"
            value={kpis.totalInventoryItems}
            subtitle={`${kpis.lowStock} low · ${kpis.outOfStock} out (Click to drill down)`}
            icon={Boxes}
            color={kpis.lowStock > 0 || kpis.outOfStock > 0 ? "danger" : "success"}
          />
        </div>
        <KPICard
          title="Active Orders"
          value={kpis.totalOrders}
          subtitle={`${kpis.pendingOrders} pending fulfillment`}
          icon={ShoppingCart}
          color="warning"
        />
        <div onClick={() => handleOpenRiskModal("FORECAST")} className="h-full flex flex-col cursor-pointer">
          <KPICard
            title="AI Forecasts"
            value={kpis.totalForecasts}
            subtitle={`${kpis.anomaliesCount || 0} anomaly alerts (Click to drill down)`}
            icon={BrainCircuit}
            color={kpis.anomaliesCount > 0 ? "warning" : "info"}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Suppliers"
          value={kpis.totalSuppliers}
          subtitle="Active procurement partners"
          icon={Truck}
          color="primary"
        />
        <div onClick={() => handleOpenRiskModal("CAPACITY")} className="h-full flex flex-col cursor-pointer">
          <KPICard
            title="Production Batches"
            value={kpis.batchesInProgress}
            subtitle={`${kpis.completedBatches} completed · ${kpis.overloadedLinesCount || 0} strain alerts`}
            icon={Factory}
            color={kpis.overloadedLinesCount > 0 ? "danger" : "primary"}
          />
        </div>
        <div onClick={() => handleOpenRiskModal("COMPLAINT")} className="h-full flex flex-col cursor-pointer">
          <KPICard
            title="Open Complaints"
            value={kpis.openComplaints}
            subtitle={`${kpis.totalComplaints} total reported (Click to drill down)`}
            icon={AlertTriangle}
            color={kpis.openComplaints > 0 ? "danger" : "success"}
          />
        </div>
        <KPICard
          title="Pending Tasks"
          value={kpis.highPriorityTasks}
          subtitle={`${kpis.totalTasks} total assigned`}
          icon={ClipboardList}
          color="warning"
        />
      </div>

      {/* Predictive Analytics Section 1: Demand Forecast & Workload */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DemandForecastChart
            data={activeDemandForecastData}
            thresholds={thresholds}
            onSelectNode={() => handleOpenRiskModal("FORECAST")}
          />
        </div>
        <div className="xl:col-span-1">
          <WorkloadForecastChart
            data={workloadForecastData}
            onSelectNode={() => handleOpenRiskModal("CAPACITY")}
          />
        </div>
      </div>

      {/* Production Capacity Heat Map */}
      <ProductionHeatMap
        data={activeProductionCapacityData}
        onSelectLine={() => handleOpenRiskModal("CAPACITY")}
      />

      {/* Operations Pipeline & Inventory Health */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Order Pipeline" subtitle="Fulfillment status breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderPipelineData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Orders" radius={[6, 6, 0, 0]}>
                {orderPipelineData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory Health" subtitle="Stock level distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={inventoryHealthData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {inventoryHealthData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* AI Recommendations + Notifications */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="AI Recommendations"
            subtitle="Predictive insights from PharmaOps engine"
            action={
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/40">
                <Sparkles size={16} className="text-primary-600 dark:text-primary-400" />
              </div>
            }
          />

          <div className="space-y-3">
            {aiRecommendations.map((rec) => (
              <Link
                key={rec.title}
                to={rec.link}
                className="group flex items-start gap-4 rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 transition-all duration-200 hover:scale-[1.01] hover:border-primary-400 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:shadow-card-hover"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/40">
                  <BrainCircuit size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-secondary-900 dark:text-white">{rec.title}</p>
                    <Badge
                      color={
                        rec.priority === "high"
                          ? "danger"
                          : rec.priority === "medium"
                            ? "warning"
                            : "info"
                      }
                      size="sm"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-secondary-500 dark:text-slate-300">{rec.description}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="mt-1 shrink-0 text-secondary-400 dark:text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Notifications" subtitle={`${kpis.unreadNotifications} unread`} />
          <div className="space-y-3">
            {notifications?.length > 0 ? (
              notifications.slice(0, 4).map((n) => (
                <NotificationCard
                  key={n._id}
                  title={n.title}
                  message={n.message}
                  type={n.type?.toLowerCase() ?? "info"}
                  isRead={n.isRead}
                  createdAt={n.createdAt}
                />
              ))
            ) : (
              <p className="py-8 text-center text-[15px] text-secondary-500 dark:text-slate-400">
                All caught up — no new notifications
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Live Queue + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding={false}>
          <div className="border-b border-secondary-200 dark:border-slate-800 p-6">
            <CardHeader
              title="Live Order Queue"
              subtitle="Orders awaiting fulfillment"
              className="mb-0"
            />
          </div>

          <div className="h-[340px] overflow-y-auto custom-scrollbar divide-y divide-secondary-100 dark:divide-slate-800/80">
            {liveQueue?.length > 0 ? (
              liveQueue.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between px-6 py-4 transition hover:bg-secondary-50 dark:hover:bg-slate-800/60"
                >
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white">
                      {order.product?.name ?? "Product"}
                    </p>
                    <p className="text-[13px] text-secondary-500 dark:text-slate-300">
                      {order.customerName} · Qty {order.quantity}
                    </p>
                  </div>
                  <StatusBadge statusMap={ORDER_STATUS} status={order.status} />
                </div>
              ))
            ) : (
              <p className="px-6 py-10 text-center text-[15px] text-secondary-500 dark:text-slate-400">
                No orders in queue
              </p>
            )}
          </div>
        </Card>

        <Card padding={false}>
          <div className="border-b border-secondary-200 dark:border-slate-800 p-6">
            <CardHeader
              title="Recent Activity"
              subtitle="Audit trail across operations"
              className="mb-0"
            />
          </div>

          <div className="h-[340px] overflow-y-auto custom-scrollbar divide-y divide-secondary-100 dark:divide-slate-800/80">
            {recentActivities?.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity._id} className="flex gap-4 px-6 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-100 dark:bg-slate-800">
                    <CheckCircle2 size={16} className="text-secondary-500 dark:text-slate-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] text-secondary-900 dark:text-slate-100">
                      <span className="font-semibold text-secondary-900 dark:text-white">{activity.user?.name ?? "System"}</span>
                      {" "}{activity.action}
                    </p>
                    <p className="text-[13px] text-secondary-500 dark:text-slate-300">
                      {activity.entity} · {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-6 py-10 text-center text-[15px] text-secondary-500 dark:text-slate-400">
                No recent activity
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Risk Drill-Down Modal */}
      <RiskDrillDownModal
        open={riskModalOpen}
        onClose={() => setRiskModalOpen(false)}
        items={activeRiskItems}
        selectedCategory={selectedRiskCategory}
      />

      {/* Configurable Alert Thresholds Modal */}
      <AlertThresholdsModal
        open={thresholdsModalOpen}
        onClose={() => setThresholdsModalOpen(false)}
        currentThresholds={thresholds}
        onSaveThresholds={handleSaveThresholds}
      />
    </PageContainer>
  );
};

export default Dashboard;
