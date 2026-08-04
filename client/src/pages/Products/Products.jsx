import { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit3, Package, Plus, Trash2 } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import { useProducts } from "../../hooks/useProducts";
import { formatCurrency } from "../../utils/formatCurrency";

const columns = [
  { header: "Product", key: "name", sortable: true, sortKey: "name" },
  { header: "SKU", key: "sku", sortable: true, sortKey: "sku" },
  { header: "Category", key: "category", sortable: true, sortKey: "category" },
  { header: "Manufacturer", key: "manufacturer", sortable: true, sortKey: "manufacturer" },
  { header: "Unit Price", key: "unitPrice", sortable: true, sortKey: "unitPrice" },
  { header: "Status", key: "status" },
  { header: "Actions", key: "actions", className: "text-right" },
];

const categoryOptions = ["Tablet", "Capsule", "Injection", "Syrup", "Cream", "Other"];

const productDefaults = {
  name: "",
  sku: "",
  category: "Tablet",
  manufacturer: "",
  description: "",
  unitPrice: "",
  reorderLevel: 100,
  isActive: "true",
};

const Products = () => {
  const {
    products,
    isLoading,
    isError,
    createProductAsync,
    updateProductAsync,
    deleteProductAsync,
    isCreating,
    isUpdating,
  } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const form = useForm({ defaultValues: productDefaults });

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load products"
        description="Please refresh the page or try again later."
      />
    );
  }

  const openCreate = () => {
    setEditingProduct(null);
    form.reset(productDefaults);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name ?? "",
      sku: product.sku ?? "",
      category: product.category ?? "Tablet",
      manufacturer: product.manufacturer ?? "",
      description: product.description ?? "",
      unitPrice: product.unitPrice ?? "",
      reorderLevel: product.reorderLevel ?? 100,
      isActive: String(product.isActive !== false),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    form.reset(productDefaults);
  };

  const saveProduct = async (values) => {
    const payload = {
      ...values,
      unitPrice: Number(values.unitPrice),
      reorderLevel: Number(values.reorderLevel),
      isActive: values.isActive === "true",
    };

    if (editingProduct) {
      await updateProductAsync({ id: editingProduct._id, payload });
    } else {
      await createProductAsync(payload);
    }
    closeModal();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        subtitle="Pharmaceutical product catalog and SKU management"
        action={<Button icon={Plus} onClick={openCreate}>Add Product</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="interactive-card">
          <p className="text-[13px] font-medium uppercase tracking-wide text-secondary-500">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-secondary-900">{products.length}</p>
        </div>
        <div className="interactive-card">
          <p className="text-[13px] font-medium uppercase tracking-wide text-secondary-500">Active SKUs</p>
          <p className="mt-2 text-3xl font-bold text-success-600">{products.filter((p) => p.isActive).length}</p>
        </div>
        <div className="interactive-card">
          <p className="text-[13px] font-medium uppercase tracking-wide text-secondary-500">Categories</p>
          <p className="mt-2 text-3xl font-bold text-primary-600">{new Set(products.map((p) => p.category)).size}</p>
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
            <TableCell><code className="rounded-md bg-secondary-100 px-2 py-0.5 text-[13px]">{product.sku}</code></TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.manufacturer}</TableCell>
            <TableCell className="font-medium">{formatCurrency(product.unitPrice)}</TableCell>
            <TableCell>
              <Badge color={product.isActive ? "success" : "secondary"} dot>{product.isActive ? "Active" : "Inactive"}</Badge>
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <Button size="sm" variant="outline" icon={Edit3} onClick={() => openEdit(product)}>Edit</Button>
                <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deleteProductAsync(product._id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modalOpen}
        title={editingProduct ? "Edit Product" : "Add Product"}
        onClose={closeModal}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="product-form" loading={isCreating || isUpdating}>
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={form.handleSubmit(saveProduct)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Product Name" error={form.formState.errors.name?.message} {...form.register("name", { required: "Product name is required" })} />
            <Input label="SKU" error={form.formState.errors.sku?.message} {...form.register("sku", { required: "SKU is required" })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Category" options={categoryOptions} {...form.register("category")} />
            <Input label="Manufacturer" error={form.formState.errors.manufacturer?.message} {...form.register("manufacturer", { required: "Manufacturer is required" })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Unit Price" type="number" min="0" step="0.01" error={form.formState.errors.unitPrice?.message} {...form.register("unitPrice", { required: "Unit price is required" })} />
            <Input label="Reorder Level" type="number" min="0" {...form.register("reorderLevel")} />
            <Select label="Status" options={[{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }]} {...form.register("isActive")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Description</label>
            <textarea rows={3} className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-[15px] focus:border-primary-600 focus:ring-2 focus:ring-primary-100" {...form.register("description")} />
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Products;
