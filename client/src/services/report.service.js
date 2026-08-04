import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const getSummaryReport = async (params) => {
  const response = await api.get(API_ENDPOINTS.REPORTS.SUMMARY, { params });
  return response.data;
};

export const getInventoryReport = async (params) => {
  const response = await api.get(API_ENDPOINTS.REPORTS.INVENTORY, { params });
  return response.data;
};

export const getOrdersReport = async (params) => {
  const response = await api.get(API_ENDPOINTS.REPORTS.ORDERS, { params });
  return response.data;
};

export const getProductionReport = async (params) => {
  const response = await api.get(API_ENDPOINTS.REPORTS.PRODUCTION, { params });
  return response.data;
};

export const getForecastReport = async (params) => {
  const response = await api.get(API_ENDPOINTS.REPORTS.FORECAST, { params });
  return response.data;
};

export const getComplaintReport = async (params) => {
  const response = await api.get(API_ENDPOINTS.REPORTS.COMPLAINTS, { params });
  return response.data;
};

export const getTaskReport = async (params) => {
  const response = await api.get(API_ENDPOINTS.REPORTS.TASKS, { params });
  return response.data;
};
