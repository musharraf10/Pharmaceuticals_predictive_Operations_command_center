import { BrainCircuit, Sparkles, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import { useForecast } from "../../hooks/useForecast";
import { formatDate } from "../../utils/formatDate";
import { formatNumber } from "../../utils/formatCurrency";
import { RISK_LEVEL } from "../../utils/statusConfig";

const CHART_COLORS = ["#16A34A", "#F59E0B", "#DC2626"];

const columns = [
  { header: "Product", key: "product", sortable: true, sortKey: "product.name" },
  { header: "Predicted Demand", key: "demand", sortable: true, sortKey: "predictedDemand" },
  { header: "Confidence", key: "confidence", sortable: true, sortKey: "confidence" },
  { header: "Risk Level", key: "riskLevel", sortable: true, sortKey: "riskLevel" },
  { header: "Model", key: "modelVersion", sortable: true, sortKey: "modelVersion" },
  { header: "Generated", key: "generatedAt", sortable: true, sortKey: "generatedAt" },
];

const Forecast = () => {
  const { forecasts, isLoading, isError, runForecastAsync, isRunning } = useForecast();

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load forecasts"
        description="Please refresh the page or try again later."
      />
    );
  }

  const highRisk = forecasts.filter((f) => f.riskLevel === "HIGH").length;
  const avgConfidence =
    forecasts.length > 0
      ? Math.round(
          forecasts.reduce((sum, f) => sum + (f.confidence ?? 0), 0) / forecasts.length,
        )
      : 0;

  const chartData = forecasts.slice(0, 8).map((f) => ({
    name: f.product?.name?.slice(0, 12) ?? "Product",
    demand: f.predictedDemand,
    confidence: f.confidence,
  }));

  const riskDistribution = [
    { name: "Low", value: forecasts.filter((f) => f.riskLevel === "LOW").length },
    { name: "Medium", value: forecasts.filter((f) => f.riskLevel === "MEDIUM").length },
    { name: "High", value: highRisk },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="AI Forecast"
        subtitle="Predictive demand intelligence powered by Gemini"
        action={
          <Button icon={Sparkles} loading={isRunning} onClick={() => runForecastAsync()}>
            Generate Forecast
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Forecasts" value={forecasts.length} icon={BrainCircuit} color="primary" />
        <KPICard title="Avg Confidence" value={`${avgConfidence}%`} icon={TrendingUp} color="success" />
        <KPICard title="High Risk Items" value={highRisk} color="danger" />
        <KPICard title="AI Model" value="Gemini" subtitle="gemini-2.5-flash" color="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Predicted Demand" subtitle="Top products by forecasted demand">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="demand" name="Demand" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader title="Risk Distribution" subtitle="Forecast risk levels across catalog" />
          <div className="flex items-center justify-center gap-8 py-6">
            {riskDistribution.map((item, i) => (
              <div key={item.name} className="text-center">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                  style={{ backgroundColor: CHART_COLORS[i] }}
                >
                  {item.value}
                </div>
                <p className="mt-2 text-[13px] font-medium text-secondary-600">{item.name} Risk</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {forecasts.length > 0 && forecasts[0]?.recommendation && (
        <Card className="border-primary-200 bg-primary-50/30">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100">
              <Sparkles size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-secondary-900">Latest AI Recommendation</p>
              <p className="mt-1 text-[15px] text-secondary-600">
                {forecasts[0].recommendation}
              </p>
            </div>
          </div>
        </Card>
      )}

      <DataTable
        data={forecasts}
        columns={columns}
        searchKeys={["product.name", "riskLevel", "modelVersion", "recommendation"]}
        searchPlaceholder="Search forecasts..."
        emptyTitle="No forecasts generated"
        emptyDescription="Run AI forecast to predict demand across your product catalog."
        renderRow={(forecast) => (
          <TableRow key={forecast._id}>
            <TableCell>
              <span className="font-medium text-secondary-900">
                {forecast.product?.name ?? "—"}
              </span>
            </TableCell>
            <TableCell className="font-semibold">
              {formatNumber(forecast.predictedDemand)} units
            </TableCell>
            <TableCell>
              <Badge color={forecast.confidence >= 80 ? "success" : "warning"}>
                {forecast.confidence}%
              </Badge>
            </TableCell>
            <TableCell>
              <StatusBadge statusMap={RISK_LEVEL} status={forecast.riskLevel} />
            </TableCell>
            <TableCell className="text-[13px] text-secondary-500">
              {forecast.modelVersion}
            </TableCell>
            <TableCell className="text-secondary-500">
              {formatDate(forecast.generatedAt)}
            </TableCell>
          </TableRow>
        )}
      />
    </PageContainer>
  );
};

export default Forecast;
