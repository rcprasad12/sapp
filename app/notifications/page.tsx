"use client";

import { useState, useEffect } from "react";

type Notification = {
  id: string;
  type: string;
  read: boolean;
  createdAt: string;
  user: {
    username: string;
    avatar: string | null;
  };
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function fetchNotifications() {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifications(data);
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    fetchNotifications();
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  function getNotificationText(type: string) {
    const [action, username] = type.split(":");
    switch (action) {
      case "like":
        return `@${username} liked your post`;
      case "comment":
        return `@${username} commented on your post`;
      case "follow":
        return `@${username} followed you`;
      default:
        return `You have a new notification`;
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="text-sm text-gray-400 hover:text-white"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center gap-3 p-4 rounded-xl border ${
                notification.read
                  ? "border-gray-800 bg-transparent"
                  : "border-gray-700 bg-gray-900"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                {notification.user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm">
                  {getNotificationText(notification.type)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!notification.read && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

