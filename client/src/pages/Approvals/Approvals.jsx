import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useApprovals } from "../../hooks/useApprovals";

const Approvals = () => {
  const { approvals, isLoading, isError } = useApprovals();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load approvals"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Approvals"
        subtitle="Review forecast decisions and sign-offs"
      />

      {approvals.length === 0 ? (
        <EmptyState
          title="No approvals found"
          description="Approval records will appear here once submitted."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(approvals, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Approvals;
