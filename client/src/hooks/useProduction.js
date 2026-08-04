import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as productionService from "../services/production.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useProduction = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.production.list(params),
    queryFn: () => productionService.getProductionBatches(params),
  });

  const createMutation = useMutation({
    mutationFn: productionService.createProductionBatch,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.production.all });
      toast.success(response.message || "Production batch created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create production batch"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      productionService.updateProductionBatch(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.production.all });
      toast.success(response.message || "Production batch updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update production batch"));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      productionService.updateBatchStatus(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.production.all });
      toast.success(response.message || "Batch status updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update batch status"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productionService.deleteProductionBatch,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.production.all });
      toast.success(response.message || "Production batch deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete production batch"));
    },
  });

  return {
    batches: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createBatch: createMutation.mutate,
    createBatchAsync: createMutation.mutateAsync,
    updateBatch: updateMutation.mutate,
    updateBatchAsync: updateMutation.mutateAsync,
    updateBatchStatus: updateStatusMutation.mutate,
    updateBatchStatusAsync: updateStatusMutation.mutateAsync,
    deleteBatch: deleteMutation.mutate,
    deleteBatchAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useProductionBatch = (id) => {
  const query = useQuery({
    queryKey: queryKeys.production.detail(id),
    queryFn: () => productionService.getProductionBatchById(id),
    enabled: Boolean(id),
  });

  return {
    batch: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
