import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useComplaints } from "../../hooks/useComplaints";

const Complaints = () => {
  const { complaints, isLoading, isError } = useComplaints();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load complaints"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Complaints"
        subtitle="Review and resolve quality complaints"
      />

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description="Complaint records will appear here once submitted."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(complaints, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Complaints;
