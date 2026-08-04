import { MoreHorizontal, Package, Plus } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import Dropdown, { DropdownItem } from "../../components/ui/Dropdown";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import { useProducts } from "../../hooks/useProducts";
import { formatCurrency } from "../../utils/formatCurrency";

const columns = [
  { header: "Product", key: "name", sortable: true, sortKey: "name" },
  { header: "SKU", key: "sku", sortable: true, sortKey: "sku" },
  { header: "Category", key: "category", sortable: true, sortKey: "category" },
  { header: "Manufacturer", key: "manufacturer", sortable: true, sortKey: "manufacturer" },
  { header: "Unit Price", key: "unitPrice", sortable: true, sortKey: "unitPrice" },
  { header: "Status", key: "status" },
  { header: "", key: "actions" },
];

const Products = () => {
  const { products, isLoading, isError } = useProducts();

  if (isLoading) return <Loader fullScreen />;

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
        subtitle="Pharmaceutical product catalog and SKU management"
        action={
          <Button icon={Plus}>Add Product</Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="interactive-card">
          <p className="text-[13px] font-medium uppercase tracking-wide text-secondary-500">
            Total Products
          </p>
          <p className="mt-2 text-3xl font-bold text-secondary-900">{products.length}</p>
        </div>
        <div className="interactive-card">
          <p className="text-[13px] font-medium uppercase tracking-wide text-secondary-500">
            Active SKUs
          </p>
          <p className="mt-2 text-3xl font-bold text-success-600">
            {products.filter((p) => p.isActive).length}
          </p>
        </div>
        <div className="interactive-card">
          <p className="text-[13px] font-medium uppercase tracking-wide text-secondary-500">
            Categories
          </p>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {new Set(products.map((p) => p.category)).size}
          </p>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchKeys={["name", "sku", "category", "manufacturer"]}
        searchPlaceholder="Search products..."
        emptyTitle="No products found"
        emptyDescription="Add your first pharmaceutical product to the catalog."
        renderRow={(product) => (
          <TableRow key={product._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                  <Package size={16} className="text-primary-600" />
                </div>
                <span className="font-medium text-secondary-900">{product.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <code className="rounded-md bg-secondary-100 px-2 py-0.5 text-[13px]">
                {product.sku}
              </code>
            </TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.manufacturer}</TableCell>
            <TableCell className="font-medium">{formatCurrency(product.unitPrice)}</TableCell>
            <TableCell>
              <Badge color={product.isActive ? "success" : "secondary"} dot>
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <Dropdown
                trigger={
                  <button className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600">
                    <MoreHorizontal size={18} />
                  </button>
                }
              >
                <DropdownItem>View Details</DropdownItem>
                <DropdownItem>Edit Product</DropdownItem>
              </Dropdown>
            </TableCell>
          </TableRow>
        )}
      />
    </PageContainer>
  );
};

export default Products;
