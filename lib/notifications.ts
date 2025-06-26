// Mock notifications data and functions

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Mock notifications data
const mockNotifications: Record<string, Notification[]> = {};

export async function getUserNotifications(userId: string) {
  // Return mock notifications for the user or an empty array
  return mockNotifications[userId] || [];
}

export async function markNotificationRead(notificationId: string) {
  // Find the notification in the mock data and mark it as read
  Object.keys(mockNotifications).forEach(userId => {
    mockNotifications[userId] = mockNotifications[userId].map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, isRead: true };
      }
      return notification;
    });
  });
  
  // Return the updated notification
  let updatedNotification: Notification | undefined;
  Object.values(mockNotifications).forEach(notifications => {
    const found = notifications.find(n => n.id === notificationId);
    if (found) {
      updatedNotification = found;
    }
  });
  
  return updatedNotification;
}

export async function markAllNotificationsRead(userId: string) {
  // Mark all notifications for the user as read
  if (mockNotifications[userId]) {
    mockNotifications[userId] = mockNotifications[userId].map(notification => ({
      ...notification,
      isRead: true
    }));
  }
  
  // Return the updated notifications
  return mockNotifications[userId] || [];
}

export async function updateUserStatus(userId: string, newStatus: string) {
  // This would update a user's status in a real database
  // For mock purposes, we'll just return a success response
  return { success: true, userId, status: newStatus };
}

// Function to add a mock notification (for testing)
export function addMockNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
  if (!mockNotifications[userId]) {
    mockNotifications[userId] = [];
  }
  
  const newNotification: Notification = {
    id: Date.now().toString(),
    userId,
    ...notification,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  
  mockNotifications[userId].unshift(newNotification);
  return newNotification;
}