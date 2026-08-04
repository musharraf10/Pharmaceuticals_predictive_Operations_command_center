import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as inventoryService from "../services/inventory.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useInventory = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.inventory.list(params),
    queryFn: () => inventoryService.getInventory(params),
  });

  const createMutation = useMutation({
    mutationFn: inventoryService.createInventory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      toast.success(response.message || "Inventory record created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create inventory record"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      inventoryService.updateInventory(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      toast.success(response.message || "Inventory updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update inventory"));
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      inventoryService.updateStock(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      toast.success(response.message || "Stock updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update stock"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryService.deleteInventory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      toast.success(response.message || "Inventory deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete inventory"));
    },
  });

  return {
    inventory: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createInventory: createMutation.mutate,
    createInventoryAsync: createMutation.mutateAsync,
    updateInventory: updateMutation.mutate,
    updateInventoryAsync: updateMutation.mutateAsync,
    updateStock: updateStockMutation.mutate,
    updateStockAsync: updateStockMutation.mutateAsync,
    deleteInventory: deleteMutation.mutate,
    deleteInventoryAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStock: updateStockMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useInventoryItem = (id) => {
  const query = useQuery({
    queryKey: queryKeys.inventory.detail(id),
    queryFn: () => inventoryService.getInventoryById(id),
    enabled: Boolean(id),
  });

  return {
    item: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
