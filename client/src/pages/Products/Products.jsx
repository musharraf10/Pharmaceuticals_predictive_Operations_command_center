import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useProducts } from "../../hooks/useProducts";

const Products = () => {
  const { products, isLoading, isError } = useProducts();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load products"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        subtitle="Manage pharmaceutical product catalog"
      />

      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Create a product to get started."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(products, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Products;
