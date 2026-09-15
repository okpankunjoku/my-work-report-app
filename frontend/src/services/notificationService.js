import api from "./api";

// ==========================================
// Get Notifications
// ==========================================

export const getNotifications = async () => {
  const response = await api.get("/notifications");

  return response.data;
};

// ==========================================
// Get Unread Notification Count
// ==========================================

export const getUnreadNotificationCount = async () => {
  const response = await api.get(
    "/notifications/unread-count"
  );

  return response.data;
};

// ==========================================
// Mark Notification As Read
// ==========================================

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(
    `/notifications/${id}/read`
  );

  return response.data;
};

// ==========================================
// Mark All Notifications As Read
// ==========================================

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch(
    "/notifications/read-all"
  );

  return response.data;
};

// ==========================================
// Delete Notification
// ==========================================

export const deleteNotification = async (id) => {
  const response = await api.delete(
    `/notifications/${id}`
  );

  return response.data;
};