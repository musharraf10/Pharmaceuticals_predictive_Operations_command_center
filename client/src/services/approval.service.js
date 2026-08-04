import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const createApproval = async (payload) => {
  const response = await api.post(API_ENDPOINTS.APPROVALS, payload);
  return response.data;
};

export const getApprovals = async (params) => {
  const response = await api.get(API_ENDPOINTS.APPROVALS, { params });
  return response.data;
};

export const getApprovalById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.APPROVALS}/${id}`);
  return response.data;
};

export const deleteApproval = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.APPROVALS}/${id}`);
  return response.data;
};
