import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const login = async (credentials) => {
  const { data } = await api.post(API_ENDPOINTS.LOGIN, credentials);

  return data;
};

export const logout = async () => {
  const { data } = await api.post(API_ENDPOINTS.LOGOUT);

  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get(API_ENDPOINTS.ME);

  return data;
};
