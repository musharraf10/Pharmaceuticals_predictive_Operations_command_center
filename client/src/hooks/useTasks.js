import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as taskService from "../services/task.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useTasks = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.tasks.list(params),
    queryFn: () => taskService.getTasks(params),
  });

  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success(response.message || "Task created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create task"));
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, payload }) => taskService.assignTask(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success(response.message || "Task assigned successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to assign task"));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      taskService.updateTaskStatus(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success(response.message || "Task status updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update task status"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => taskService.updateTask(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success(response.message || "Task updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update task"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success(response.message || "Task deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete task"));
    },
  });

  return {
    tasks: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createTask: createMutation.mutate,
    createTaskAsync: createMutation.mutateAsync,
    assignTask: assignMutation.mutate,
    assignTaskAsync: assignMutation.mutateAsync,
    updateTaskStatus: updateStatusMutation.mutate,
    updateTaskStatusAsync: updateStatusMutation.mutateAsync,
    updateTask: updateMutation.mutate,
    updateTaskAsync: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutate,
    deleteTaskAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isAssigning: assignMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useTask = (id) => {
  const query = useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => taskService.getTaskById(id),
    enabled: Boolean(id),
  });

  return {
    task: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
