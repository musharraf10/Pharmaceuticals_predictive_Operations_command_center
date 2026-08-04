import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as userService from "../services/user.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useUsers = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => userService.getUsers(params),
  });

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(response.message || "User created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create user"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => userService.updateUser(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(response.message || "User updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update user"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(response.message || "User deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete user"));
    },
  });

  return {
    users: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createUser: createMutation.mutate,
    createUserAsync: createMutation.mutateAsync,
    updateUser: updateMutation.mutate,
    updateUserAsync: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutate,
    deleteUserAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useUser = (id) => {
  const query = useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: Boolean(id),
  });

  return {
    user: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
