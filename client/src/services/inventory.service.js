import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const createInventory = async (payload) => {
  const response = await api.post(API_ENDPOINTS.INVENTORY, payload);
  return response.data;
};

export const getInventory = async (params) => {
  const response = await api.get(API_ENDPOINTS.INVENTORY, { params });
  return response.data;
};

export const getInventoryById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.INVENTORY}/${id}`);
  return response.data;
};

export const updateInventory = async (id, payload) => {
  const response = await api.put(`${API_ENDPOINTS.INVENTORY}/${id}`, payload);
  return response.data;
};

export const updateStock = async (id, payload) => {
  const response = await api.patch(
    `${API_ENDPOINTS.INVENTORY}/${id}/stock`,
    payload,
  );
  return response.data;
};

export const deleteInventory = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.INVENTORY}/${id}`);
  return response.data;
};
