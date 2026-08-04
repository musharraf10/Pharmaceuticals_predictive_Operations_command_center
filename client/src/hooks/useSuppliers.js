import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as supplierService from "../services/supplier.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useSuppliers = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.suppliers.list(params),
    queryFn: () => supplierService.getSuppliers(params),
  });

  const createMutation = useMutation({
    mutationFn: supplierService.createSupplier,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
      toast.success(response.message || "Supplier created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create supplier"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      supplierService.updateSupplier(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
      toast.success(response.message || "Supplier updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update supplier"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: supplierService.deleteSupplier,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
      toast.success(response.message || "Supplier deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete supplier"));
    },
  });

  return {
    suppliers: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createSupplier: createMutation.mutate,
    createSupplierAsync: createMutation.mutateAsync,
    updateSupplier: updateMutation.mutate,
    updateSupplierAsync: updateMutation.mutateAsync,
    deleteSupplier: deleteMutation.mutate,
    deleteSupplierAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useSupplier = (id) => {
  const query = useQuery({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => supplierService.getSupplierById(id),
    enabled: Boolean(id),
  });

  return {
    supplier: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
