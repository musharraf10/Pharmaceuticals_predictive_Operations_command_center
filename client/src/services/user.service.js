import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const createUser = async (payload) => {
  const response = await api.post(API_ENDPOINTS.USERS, payload);
  return response.data;
};

export const getUsers = async (params) => {
  const response = await api.get(API_ENDPOINTS.USERS, { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
  return response.data;
};

export const updateUser = async (id, payload) => {
  const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
  return response.data;
};
