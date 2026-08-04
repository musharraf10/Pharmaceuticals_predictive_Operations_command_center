import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const createProductionBatch = async (payload) => {
  const response = await api.post(API_ENDPOINTS.PRODUCTION, payload);
  return response.data;
};

export const getProductionBatches = async (params) => {
  const response = await api.get(API_ENDPOINTS.PRODUCTION, { params });
  return response.data;
};

export const getProductionBatchById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.PRODUCTION}/${id}`);
  return response.data;
};

export const updateProductionBatch = async (id, payload) => {
  const response = await api.put(`${API_ENDPOINTS.PRODUCTION}/${id}`, payload);
  return response.data;
};

export const updateBatchStatus = async (id, payload) => {
  const response = await api.patch(
    `${API_ENDPOINTS.PRODUCTION}/${id}/status`,
    payload,
  );
  return response.data;
};

export const deleteProductionBatch = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.PRODUCTION}/${id}`);
  return response.data;
};
