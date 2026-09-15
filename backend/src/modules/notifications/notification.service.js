const AppError = require("../../utils/AppError");

const notificationRepository = require("./notification.repository");

// ==========================================
// Create Notification
// ==========================================

const createNotification = async (employeeId, data) => {
  const {
    title,
    message,
    type = "system",
  } = data;

  if (!title || !message) {
    throw new AppError(
      "Notification title and message are required.",
      400
    );
  }

  return await notificationRepository.createNotification({
    employee: employeeId,
    title,
    message,
    type,
  });
};

// ==========================================
// Get Notifications
// ==========================================

const getNotifications = async (employee) => {
  return await notificationRepository.getNotifications(
    employee._id
  );
};

// ==========================================
// Get Unread Count
// ==========================================

const getUnreadCount = async (employee) => {
  return await notificationRepository.getUnreadCount(
    employee._id
  );
};

// ==========================================
// Mark Notification As Read
// ==========================================

const markNotificationAsRead = async (
  employee,
  notificationId
) => {
  const notification =
    await notificationRepository.findById(
      notificationId
    );

  if (!notification) {
    throw new AppError(
      "Notification not found.",
      404
    );
  }

  // Make sure the employee owns this notification
  if (
    notification.employee.toString() !==
    employee._id.toString()
  ) {
    throw new AppError(
      "You are not authorized to access this notification.",
      403
    );
  }

  return await notificationRepository.markAsRead(
    notificationId
  );
};

// ==========================================
// Mark All Notifications As Read
// ==========================================

const markAllNotificationsAsRead = async (
  employee
) => {
  return await notificationRepository.markAllAsRead(
    employee._id
  );
};

// ==========================================
// Delete Notification
// ==========================================

const deleteNotification = async (
  employee,
  notificationId
) => {
  const notification =
    await notificationRepository.findById(
      notificationId
    );

  if (!notification) {
    throw new AppError(
      "Notification not found.",
      404
    );
  }

  // Make sure the employee owns this notification
  if (
    notification.employee.toString() !==
    employee._id.toString()
  ) {
    throw new AppError(
      "You are not authorized to delete this notification.",
      403
    );
  }

  return await notificationRepository.deleteNotification(
    notificationId
  );
};

// ==========================================
// Export
// ==========================================

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};