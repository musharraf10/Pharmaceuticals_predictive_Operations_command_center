import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const createSupplier = async (payload) => {
  const response = await api.post(API_ENDPOINTS.SUPPLIERS, payload);
  return response.data;
};

export const getSuppliers = async (params) => {
  const response = await api.get(API_ENDPOINTS.SUPPLIERS, { params });
  return response.data;
};

export const getSupplierById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.SUPPLIERS}/${id}`);
  return response.data;
};

export const updateSupplier = async (id, payload) => {
  const response = await api.put(`${API_ENDPOINTS.SUPPLIERS}/${id}`, payload);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.SUPPLIERS}/${id}`);
  return response.data;
};
