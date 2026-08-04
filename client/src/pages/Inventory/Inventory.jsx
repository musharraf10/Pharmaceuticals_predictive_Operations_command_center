import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useInventory } from "../../hooks/useInventory";

const Inventory = () => {
  const { inventory, isLoading, isError } = useInventory();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load inventory"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels and warehouse records"
      />

      {inventory.length === 0 ? (
        <EmptyState
          title="No inventory records"
          description="Inventory items will appear here once added."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(inventory, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Inventory;
