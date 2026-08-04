import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const createProduct = async (payload) => {
  const response = await api.post(API_ENDPOINTS.PRODUCTS, payload);
  return response.data;
};

export const getProducts = async (params) => {
  const response = await api.get(API_ENDPOINTS.PRODUCTS, { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  return response.data;
};

export const updateProduct = async (id, payload) => {
  const response = await api.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, payload);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  return response.data;
};
