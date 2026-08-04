import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useProduction } from "../../hooks/useProduction";

const Production = () => {
  const { batches, isLoading, isError } = useProduction();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load production batches"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Production"
        subtitle="Monitor manufacturing batches and status"
      />

      {batches.length === 0 ? (
        <EmptyState
          title="No production batches"
          description="Production batches will appear here once scheduled."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(batches, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Production;
