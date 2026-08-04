import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useSummaryReport } from "../../hooks/useReports";

const Reports = () => {
  const { report, isLoading, isError } = useSummaryReport();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load reports"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        subtitle="Analytics and operational reporting"
      />

      {report ? (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(report, null, 2)}
        </pre>
      ) : (
        <EmptyState
          title="No report data"
          description="Report data will appear here once available."
        />
      )}
    </PageContainer>
  );
};

export default Reports;
