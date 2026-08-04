import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as complaintService from "../services/complaint.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useComplaints = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.complaints.list(params),
    queryFn: () => complaintService.getComplaints(params),
  });

  const createMutation = useMutation({
    mutationFn: complaintService.createComplaint,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      toast.success(response.message || "Complaint submitted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to submit complaint"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      complaintService.updateComplaint(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      toast.success(response.message || "Complaint updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update complaint"));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      complaintService.updateComplaintStatus(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      toast.success(response.message || "Complaint status updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update complaint status"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: complaintService.deleteComplaint,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      toast.success(response.message || "Complaint deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete complaint"));
    },
  });

  return {
    complaints: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createComplaint: createMutation.mutate,
    createComplaintAsync: createMutation.mutateAsync,
    updateComplaint: updateMutation.mutate,
    updateComplaintAsync: updateMutation.mutateAsync,
    updateComplaintStatus: updateStatusMutation.mutate,
    updateComplaintStatusAsync: updateStatusMutation.mutateAsync,
    deleteComplaint: deleteMutation.mutate,
    deleteComplaintAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useComplaint = (id) => {
  const query = useQuery({
    queryKey: queryKeys.complaints.detail(id),
    queryFn: () => complaintService.getComplaintById(id),
    enabled: Boolean(id),
  });

  return {
    complaint: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
