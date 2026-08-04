import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useOrders } from "../../hooks/useOrders";

const Orders = () => {
  const { orders, isLoading, isError } = useOrders();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load orders"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Orders"
        subtitle="Track purchase and fulfillment orders"
      />

      {orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Orders will appear here once created."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(orders, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Orders;
