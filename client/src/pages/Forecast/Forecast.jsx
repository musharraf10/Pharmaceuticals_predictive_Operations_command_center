import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useForecast } from "../../hooks/useForecast";

const Forecast = () => {
  const { forecasts, isLoading, isError } = useForecast();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load forecasts"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Forecast"
        subtitle="AI-driven demand and supply predictions"
      />

      {forecasts.length === 0 ? (
        <EmptyState
          title="No forecasts available"
          description="Run a forecast to generate predictive insights."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(forecasts, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Forecast;
