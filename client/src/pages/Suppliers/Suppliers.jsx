import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useSuppliers } from "../../hooks/useSuppliers";

const Suppliers = () => {
  const { suppliers, isLoading, isError } = useSuppliers();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load suppliers"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Suppliers"
        subtitle="Manage vendor and supplier relationships"
      />

      {suppliers.length === 0 ? (
        <EmptyState
          title="No suppliers found"
          description="Add a supplier to begin procurement tracking."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(suppliers, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Suppliers;
