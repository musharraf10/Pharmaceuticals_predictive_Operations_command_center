import api from "../api/api";
import { API_ENDPOINTS } from "../constants/api";

export const getNotifications = async (params) => {
  const response = await api.get(API_ENDPOINTS.NOTIFICATIONS, { params });
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.patch(
    `${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`,
  );
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.patch(
    API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ,
  );
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.NOTIFICATIONS}/${id}`);
  return response.data;
};
