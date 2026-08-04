import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const createComplaint = async (payload) => {
  const response = await api.post(API_ENDPOINTS.COMPLAINTS, payload);
  return response.data;
};

export const getComplaints = async (params) => {
  const response = await api.get(API_ENDPOINTS.COMPLAINTS, { params });
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.COMPLAINTS}/${id}`);
  return response.data;
};

export const updateComplaint = async (id, payload) => {
  const response = await api.put(`${API_ENDPOINTS.COMPLAINTS}/${id}`, payload);
  return response.data;
};

export const updateComplaintStatus = async (id, payload) => {
  const response = await api.patch(
    `${API_ENDPOINTS.COMPLAINTS}/${id}/status`,
    payload,
  );
  return response.data;
};

export const deleteComplaint = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.COMPLAINTS}/${id}`);
  return response.data;
};
