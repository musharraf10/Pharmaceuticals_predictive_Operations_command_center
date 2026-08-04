import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../constants/queryKeys";
import * as reportService from "../services/report.service";

const createReportHook = (queryKey, queryFn) => (params = {}) => {
  const query = useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => queryFn(params),
  });

  return {
    report: query.data?.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useReports = () => {
  const summary = createReportHook(
    queryKeys.reports.summary,
    reportService.getSummaryReport,
  )();

  const inventory = createReportHook(
    queryKeys.reports.inventory,
    reportService.getInventoryReport,
  )();

  const orders = createReportHook(
    queryKeys.reports.orders,
    reportService.getOrdersReport,
  )();

  const production = createReportHook(
    queryKeys.reports.production,
    reportService.getProductionReport,
  )();

  const forecast = createReportHook(
    queryKeys.reports.forecast,
    reportService.getForecastReport,
  )();

  const complaints = createReportHook(
    queryKeys.reports.complaints,
    reportService.getComplaintReport,
  )();

  const tasks = createReportHook(
    queryKeys.reports.tasks,
    reportService.getTaskReport,
  )();

  return {
    summary,
    inventory,
    orders,
    production,
    forecast,
    complaints,
    tasks,
  };
};

export const useSummaryReport = createReportHook(
  queryKeys.reports.summary,
  reportService.getSummaryReport,
);

export const useInventoryReport = createReportHook(
  queryKeys.reports.inventory,
  reportService.getInventoryReport,
);

export const useOrdersReport = createReportHook(
  queryKeys.reports.orders,
  reportService.getOrdersReport,
);

export const useProductionReport = createReportHook(
  queryKeys.reports.production,
  reportService.getProductionReport,
);

export const useForecastReport = createReportHook(
  queryKeys.reports.forecast,
  reportService.getForecastReport,
);

export const useComplaintReport = createReportHook(
  queryKeys.reports.complaints,
  reportService.getComplaintReport,
);

export const useTaskReport = createReportHook(
  queryKeys.reports.tasks,
  reportService.getTaskReport,
);
