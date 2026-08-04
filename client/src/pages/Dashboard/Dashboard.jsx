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
  Sparkles,
  TrendingUp,
  Truck,
} from "lucide-react";
import {
  Area,
  AreaChart,
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
import { exportCsv } from "../../utils/exportCsv";
import { formatRelativeTime } from "../../utils/formatDate";
import { ORDER_STATUS } from "../../utils/statusConfig";

const CHART_COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#0891B2"];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-secondary-200 bg-white px-4 py-3 shadow-dropdown">
      <p className="mb-1 text-[13px] font-medium text-secondary-500">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold text-secondary-900">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { dashboard, isLoading, isError } = useDashboard();

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

  const { kpis, liveQueue, recentActivities, notifications } = dashboard;

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

  const productionData = [
    { name: "Planned", batches: kpis.plannedBatches },
    { name: "In Progress", batches: kpis.batchesInProgress },
    { name: "Completed", batches: kpis.completedBatches },
    { name: "Rejected", batches: kpis.rejectedBatches },
  ];

  const forecastTrend = [
    { month: "Jan", demand: 4200, forecast: 4100 },
    { month: "Feb", demand: 3800, forecast: 3950 },
    { month: "Mar", demand: 5100, forecast: 5050 },
    { month: "Apr", demand: 4600, forecast: 4700 },
    { month: "May", demand: 5400, forecast: 5300 },
    { month: "Jun", demand: kpis.totalForecasts * 120 || 5800, forecast: 5900 },
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
    { label: "New Order", icon: ShoppingCart, path: "/orders", color: "primary" },
    { label: "Run Forecast", icon: BrainCircuit, path: "/forecast", color: "info" },
    { label: "View Inventory", icon: Boxes, path: "/inventory", color: "success" },
    { label: "Production", icon: Factory, path: "/production", color: "warning" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Operations Command Center"
        subtitle="Real-time supply chain intelligence and predictive insights"
        action={
          <div className="flex items-center gap-2">
            <Badge color="success" dot>Live</Badge>
            <Button variant="outline" icon={TrendingUp} onClick={exportDashboard}>
              Export Report
            </Button>
          </div>
        }
      />

      {/* KPI Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total Products"
          value={kpis.totalProducts}
          subtitle="Active catalog SKUs"
          icon={Package}
          color="primary"
        />
        <KPICard
          title="Inventory Items"
          value={kpis.totalInventoryItems}
          subtitle={`${kpis.lowStock} low · ${kpis.outOfStock} out`}
          icon={Boxes}
          color="success"
        />
        <KPICard
          title="Active Orders"
          value={kpis.totalOrders}
          subtitle={`${kpis.pendingOrders} pending fulfillment`}
          icon={ShoppingCart}
          color="warning"
        />
        <KPICard
          title="AI Forecasts"
          value={kpis.totalForecasts}
          subtitle="Predictive models active"
          icon={BrainCircuit}
          color="info"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Suppliers"
          value={kpis.totalSuppliers}
          icon={Truck}
          color="secondary"
        />
        <KPICard
          title="Production Batches"
          value={kpis.batchesInProgress}
          subtitle={`${kpis.completedBatches} completed`}
          icon={Factory}
          color="primary"
        />
        <KPICard
          title="Open Complaints"
          value={kpis.openComplaints}
          subtitle={`${kpis.totalComplaints} total reported`}
          icon={AlertTriangle}
          color="danger"
        />
        <KPICard
          title="Pending Tasks"
          value={kpis.highPriorityTasks}
          subtitle={`${kpis.totalTasks} total assigned`}
          icon={ClipboardList}
          color="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard
          title="Order Pipeline"
          subtitle="Fulfillment status breakdown"
          className="xl:col-span-1"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderPipelineData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
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

        <ChartCard
          title="Demand Forecast Trend"
          subtitle="Actual vs predicted demand"
          className="lg:col-span-2 xl:col-span-1"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="demand" name="Actual" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#16A34A" fill="#16A34A" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Production + Quick Actions + AI */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Production Overview" subtitle="Batch status by stage" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productionData} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="batches" name="Batches" fill="#2563EB" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader title="Quick Actions" subtitle="Common workflows" />
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex flex-col items-center gap-2 rounded-xl border border-secondary-200 p-4 text-center transition-all duration-200 hover:scale-[1.02] hover:border-primary-200 hover:bg-primary-50 hover:shadow-card"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={20} />
                  </div>
                  <span className="text-[13px] font-medium text-secondary-700">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* AI Recommendations + Notifications */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="AI Recommendations"
            subtitle="Predictive insights from PharmaOps engine"
            action={
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                <Sparkles size={16} className="text-primary-600" />
              </div>
            }
          />

          <div className="space-y-3">
            {aiRecommendations.map((rec) => (
              <Link
                key={rec.title}
                to={rec.link}
                className="group flex items-start gap-4 rounded-xl border border-secondary-200 p-4 transition-all duration-200 hover:scale-[1.01] hover:border-primary-200 hover:shadow-card-hover"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <BrainCircuit size={18} className="text-primary-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-secondary-900">{rec.title}</p>
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
                  <p className="mt-1 text-[13px] text-secondary-500">{rec.description}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="mt-1 shrink-0 text-secondary-400 transition group-hover:translate-x-0.5 group-hover:text-primary-600"
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
              <p className="py-8 text-center text-[15px] text-secondary-500">
                All caught up — no new notifications
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Live Queue + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding={false}>
          <div className="border-b border-secondary-200 p-6">
            <CardHeader
              title="Live Order Queue"
              subtitle="Orders awaiting fulfillment"
              className="mb-0"
            />
          </div>

          <div className="h-[340px] overflow-y-auto custom-scrollbar divide-y divide-secondary-100">
            {liveQueue?.length > 0 ? (
              liveQueue.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between px-6 py-4 transition hover:bg-secondary-50"
                >
                  <div>
                    <p className="font-medium text-secondary-900">
                      {order.product?.name ?? "Product"}
                    </p>
                    <p className="text-[13px] text-secondary-500">
                      {order.customerName} · Qty {order.quantity}
                    </p>
                  </div>
                  <StatusBadge statusMap={ORDER_STATUS} status={order.status} />
                </div>
              ))
            ) : (
              <p className="px-6 py-10 text-center text-[15px] text-secondary-500">
                No orders in queue
              </p>
            )}
          </div>
        </Card>

        <Card padding={false}>
          <div className="border-b border-secondary-200 p-6">
            <CardHeader
              title="Recent Activity"
              subtitle="Audit trail across operations"
              className="mb-0"
            />
          </div>

          <div className="h-[340px] overflow-y-auto custom-scrollbar divide-y divide-secondary-100">
            {recentActivities?.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity._id} className="flex gap-4 px-6 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-100">
                    <CheckCircle2 size={16} className="text-secondary-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] text-secondary-900">
                      <span className="font-medium">{activity.user?.name ?? "System"}</span>
                      {" "}{activity.action}
                    </p>
                    <p className="text-[13px] text-secondary-500">
                      {activity.entity} · {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-6 py-10 text-center text-[15px] text-secondary-500">
                No recent activity
              </p>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
