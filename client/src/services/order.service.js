import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const createOrder = async (payload) => {
  const response = await api.post(API_ENDPOINTS.ORDERS, payload);
  return response.data;
};

export const getOrders = async (params) => {
  const response = await api.get(API_ENDPOINTS.ORDERS, { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/${id}`);
  return response.data;
};

export const updateOrder = async (id, payload) => {
  const response = await api.put(`${API_ENDPOINTS.ORDERS}/${id}`, payload);
  return response.data;
};

export const updateOrderStatus = async (id, payload) => {
  const response = await api.patch(
    `${API_ENDPOINTS.ORDERS}/${id}/status`,
    payload,
  );
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
  return response.data;
};
