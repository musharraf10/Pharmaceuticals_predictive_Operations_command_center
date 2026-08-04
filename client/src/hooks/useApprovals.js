import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as approvalService from "../services/approval.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useApprovals = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.approvals.list(params),
    queryFn: () => approvalService.getApprovals(params),
  });

  const createMutation = useMutation({
    mutationFn: approvalService.createApproval,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.forecast.all });
      toast.success(response.message || "Decision recorded successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to record decision"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: approvalService.deleteApproval,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all });
      toast.success(response.message || "Approval deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete approval"));
    },
  });

  return {
    approvals: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createApproval: createMutation.mutate,
    createApprovalAsync: createMutation.mutateAsync,
    deleteApproval: deleteMutation.mutate,
    deleteApprovalAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useApproval = (id) => {
  const query = useQuery({
    queryKey: queryKeys.approvals.detail(id),
    queryFn: () => approvalService.getApprovalById(id),
    enabled: Boolean(id),
  });

  return {
    approval: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
