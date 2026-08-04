import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useDashboard } from "../../hooks/useDashboard";

const Dashboard = () => {
  const { dashboard, isLoading, isError } = useDashboard();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Operational overview and key metrics"
      />

      {dashboard ? (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(dashboard, null, 2)}
        </pre>
      ) : (
        <EmptyState
          title="No dashboard data"
          description="Dashboard metrics will appear here once available."
        />
      )}
    </PageContainer>
  );
};

export default Dashboard;
