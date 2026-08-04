import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const login = async (credentials) => {
  const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post(API_ENDPOINTS.LOGOUT);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get(API_ENDPOINTS.ME);
  return response.data;
};
