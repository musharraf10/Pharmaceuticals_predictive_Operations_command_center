import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as notificationService from "../services/notification.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useNotifications = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => notificationService.getNotifications(params),
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success(response.message || "Notification marked as read");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to mark notification as read"));
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success(response.message || "All notifications marked as read");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to mark all notifications as read"),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success(response.message || "Notification deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete notification"));
    },
  });

  return {
    notifications: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    markAsRead: markAsReadMutation.mutate,
    markAsReadAsync: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutate,
    markAllAsReadAsync: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteMutation.mutate,
    deleteNotificationAsync: deleteMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
