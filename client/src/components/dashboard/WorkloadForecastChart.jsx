import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartCard from "../ui/ChartCard";
import { useLayout } from "../../hooks/useLayout";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-dropdown text-xs space-y-2 min-w-[180px]">
      <p className="font-bold border-b border-secondary-100 dark:border-slate-800 pb-1.5 text-secondary-900 dark:text-white">
        {label} Workload
      </p>
      <div className="flex items-center justify-between">
        <span className="text-secondary-500 dark:text-slate-400">Planned Batches:</span>
        <span className="font-bold text-primary-600 dark:text-primary-400">{data?.plannedBatches}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-secondary-500 dark:text-slate-400">In Progress:</span>
        <span className="font-bold text-amber-500">{data?.inProgressBatches}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-secondary-500 dark:text-slate-400">Total Workload Units:</span>
        <span className="font-bold text-secondary-900 dark:text-white">{data?.workloadUnits}</span>
      </div>
    </div>
  );
};

const WorkloadForecastChart = ({ data = [], onSelectNode }) => {
  const { theme } = useLayout();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#334155" : "#E2E8F0";
  const tickColor = isDark ? "#CBD5E1" : "#64748B";

  const BAR_COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"];

  return (
    <ChartCard
      title="Workload Projection Forecast"
      subtitle="Operational manufacturing workload distribution"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={26}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="line" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="workloadUnits"
            name="Workload Units"
            radius={[6, 6, 0, 0]}
            onClick={(entry) => onSelectNode && onSelectNode(entry)}
            className="cursor-pointer hover:opacity-80 transition"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default WorkloadForecastChart;
