import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as orderService from "../services/order.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useOrders = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => orderService.getOrders(params),
  });

  const createMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success(response.message || "Order created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create order"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => orderService.updateOrder(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success(response.message || "Order updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update order"));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      orderService.updateOrderStatus(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success(response.message || "Order status updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update order status"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: orderService.deleteOrder,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success(response.message || "Order deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete order"));
    },
  });

  return {
    orders: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createOrder: createMutation.mutate,
    createOrderAsync: createMutation.mutateAsync,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    updateOrderStatus: updateStatusMutation.mutate,
    updateOrderStatusAsync: updateStatusMutation.mutateAsync,
    deleteOrder: deleteMutation.mutate,
    deleteOrderAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useOrder = (id) => {
  const query = useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: Boolean(id),
  });

  return {
    order: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
