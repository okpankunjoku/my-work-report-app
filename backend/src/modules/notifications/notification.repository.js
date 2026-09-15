const Notification = require("../../models/Notification");

// ==========================================
// Create Notification
// ==========================================

const createNotification = async (notificationData) => {
  return await Notification.create(notificationData);
};

// ==========================================
// Get Notifications For Employee
// ==========================================

const getNotifications = async (
  employeeId,
  options = {}
) => {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
  } = options;

  const skip = (page - 1) * limit;

  const filter = {
    employee: employeeId,
  };

  if (unreadOnly) {
    filter.isRead = false;
  }

  const [notifications, total] =
    await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Notification.countDocuments(filter),
    ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// ==========================================
// Get Unread Notifications
// ==========================================

const getUnreadNotifications = async (
  employeeId
) => {
  return await Notification.find({
    employee: employeeId,
    isRead: false,
  }).sort({
    createdAt: -1,
  });
};

// ==========================================
// Get Unread Count
// ==========================================

const getUnreadCount = async (employeeId) => {
  return await Notification.countDocuments({
    employee: employeeId,
    isRead: false,
  });
};

// ==========================================
// Find Notification By ID
// ==========================================

const findById = async (id) => {
  return await Notification.findById(id);
};

// ==========================================
// Mark Notification As Read
// ==========================================

const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    {
      isRead: true,
    },
    {
      new: true,
    }
  );
};

// ==========================================
// Mark All Notifications As Read
// ==========================================

const markAllAsRead = async (employeeId) => {
  return await Notification.updateMany(
    {
      employee: employeeId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );
};

// ==========================================
// Delete Notification
// ==========================================

const deleteNotification = async (id) => {
  return await Notification.findByIdAndDelete(id);
};

// ==========================================
// Export
// ==========================================

module.exports = {
  createNotification,
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  findById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};