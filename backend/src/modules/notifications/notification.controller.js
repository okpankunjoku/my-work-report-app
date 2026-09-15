const notificationService = require("./notification.service");

// GET /notifications
// Get logged-in user's notifications
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const unreadOnly =
      req.query.unreadOnly === "true";

    const result = await notificationService.getNotifications(
      userId,
      {
        page,
        limit,
        unreadOnly,
      }
    );

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET /notifications/unread-count
// Get number of unread notifications
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const count =
      await notificationService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      message: "Unread notification count retrieved successfully",
      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /notifications/:id/read
// Mark one notification as read
const markNotificationAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notification =
      await notificationService.markNotificationAsRead(
        id,
        userId
      );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /notifications/read-all
// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result =
      await notificationService.markAllNotificationsAsRead(
        userId
      );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /notifications/:id
// Delete one notification
const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    await notificationService.removeNotification(
      id,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};