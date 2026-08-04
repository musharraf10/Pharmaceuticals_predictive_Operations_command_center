import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const createTask = async (payload) => {
  const response = await api.post(API_ENDPOINTS.TASKS, payload);
  return response.data;
};

export const getTasks = async (params) => {
  const response = await api.get(API_ENDPOINTS.TASKS, { params });
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.TASKS}/${id}`);
  return response.data;
};

export const assignTask = async (id, payload) => {
  const response = await api.patch(
    `${API_ENDPOINTS.TASKS}/${id}/assign`,
    payload,
  );
  return response.data;
};

export const updateTaskStatus = async (id, payload) => {
  const response = await api.patch(
    `${API_ENDPOINTS.TASKS}/${id}/status`,
    payload,
  );
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.TASKS}/${id}`);
  return response.data;
};
