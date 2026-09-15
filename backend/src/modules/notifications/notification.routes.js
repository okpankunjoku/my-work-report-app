const express = require("express");

const router = express.Router();

const notificationController = require("./notification.controller");

const { protect } = require("../../middlewares/auth.middleware");

// ==========================================
// Get All Notifications
// GET /api/v1/notifications
// ==========================================

router.get(
  "/",
  protect,
  notificationController.getNotifications
);

// ==========================================
// Get Unread Notification Count
// GET /api/v1/notifications/unread-count
// ==========================================

router.get(
  "/unread-count",
  protect,
  notificationController.getUnreadCount
);

// ==========================================
// Mark All Notifications As Read
// PATCH /api/v1/notifications/read-all
// ==========================================

router.patch(
  "/read-all",
  protect,
  notificationController.markAllNotificationsAsRead
);

// ==========================================
// Mark Notification As Read
// PATCH /api/v1/notifications/:id/read
// ==========================================

router.patch(
  "/:id/read",
  protect,
  notificationController.markNotificationAsRead
);

// ==========================================
// Delete Notification
// DELETE /api/v1/notifications/:id
// ==========================================

router.delete(
  "/:id",
  protect,
  notificationController.deleteNotification
);

module.exports = router;