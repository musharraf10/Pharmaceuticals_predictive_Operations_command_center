import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const getAuditLogs = async (params) => {
  const response = await api.get(API_ENDPOINTS.AUDIT_LOGS, { params });
  return response.data;
};

export const getAuditLogById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.AUDIT_LOGS}/${id}`);
  return response.data;
};
