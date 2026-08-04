import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryKeys } from "../constants/queryKeys";
import * as forecastService from "../services/forecast.service";
import getErrorMessage from "../utils/getErrorMessage";

export const useForecast = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.forecast.list(params),
    queryFn: () => forecastService.getForecasts(params),
  });

  const runMutation = useMutation({
    mutationFn: forecastService.runForecast,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forecast.all });
      toast.success(response.message || "Forecast generated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to run forecast"));
    },
  });

  return {
    forecasts: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    runForecast: runMutation.mutate,
    runForecastAsync: runMutation.mutateAsync,
    isRunning: runMutation.isPending,
  };
};

export const useForecastById = (id) => {
  const query = useQuery({
    queryKey: queryKeys.forecast.detail(id),
    queryFn: () => forecastService.getForecastById(id),
    enabled: Boolean(id),
  });

  return {
    forecast: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
