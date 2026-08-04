import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const getDashboard = async () => {
  const response = await api.get(API_ENDPOINTS.DASHBOARD);
  return response.data;
};
