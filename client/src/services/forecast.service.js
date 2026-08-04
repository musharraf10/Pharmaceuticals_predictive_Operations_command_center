import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const runForecast = async (payload) => {
  const response = await api.post(API_ENDPOINTS.FORECAST_RUN, payload);
  return response.data;
};

export const getForecasts = async (params) => {
  const response = await api.get(API_ENDPOINTS.FORECAST, { params });
  return response.data;
};

export const getForecastById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.FORECAST}/${id}`);
  return response.data;
};
