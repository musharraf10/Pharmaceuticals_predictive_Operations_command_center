import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../constants/queryKeys";
import * as dashboardService from "../services/dashboard.service";

export const useDashboard = () => {
  const query = useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardService.getDashboard,
  });

  return {
    dashboard: query.data?.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
