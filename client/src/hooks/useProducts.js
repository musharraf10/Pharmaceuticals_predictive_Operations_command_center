import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as productService from "../services/product.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useProducts = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productService.getProducts(params),
  });

  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success(response.message || "Product created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create product"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      productService.updateProduct(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success(response.message || "Product updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update product"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success(response.message || "Product deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete product"));
    },
  });

  return {
    products: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createProduct: createMutation.mutate,
    createProductAsync: createMutation.mutateAsync,
    updateProduct: updateMutation.mutate,
    updateProductAsync: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutate,
    deleteProductAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useProduct = (id) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => productService.updateProduct(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(id),
      });
      toast.success(response.message || "Product updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update product"));
    },
  });

  return {
    product: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateProduct: updateMutation.mutate,
    updateProductAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
