"use client";
import { useAuth } from "@/app/content/authContent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Clock,
  Mail,
  MailOpen,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationSection({ user, countryCode }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const isGerman = countryCode === "DE";

  // Calculate stats
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(
      (n) => n?.status?.[0]?.state === "unread" || n?.status === "unread"
    ).length;
    return { total, unread };
  }, [notifications]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter(
        (n) => n?.status?.[0]?.state === "unread" || n?.status === "unread"
      );
    }
    return notifications;
  }, [notifications, activeFilter]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/all/user/${user._id}`
      );
      if (data?.success) {
        setNotifications(data.notifications?.reverse() || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
    // eslint-disable-next-line
  }, [user]);

  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/read/${id}`
      );
      if (data?.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id
              ? { ...n, status: [{ ...n.status?.[0], state: "read" }] }
              : n
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1
        ? isGerman
          ? "Gerade eben"
          : "Just now"
        : `${diffInMinutes} ${isGerman ? "Minuten" : "minutes"} ${
            isGerman ? "vor" : "ago"
          }`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} ${isGerman ? "Stunden" : "hours"} ${
        isGerman ? "vor" : "ago"
      }`;
    }
    if (diffInHours < 48) {
      return isGerman ? "Gestern" : "Yesterday";
    }

    return date.toLocaleDateString(isGerman ? "de-DE" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    const isUnread =
      notification?.status?.[0]?.state === "unread" ||
      notification?.status === "unread";
    if (isUnread) {
      markNotificationAsRead(notification._id);
    }
  };

  // Get notification type color
  const getTypeColor = (type) => {
    switch (type) {
      case "marketing":
        return "bg-green-100 text-green-700 border-green-200";
      case "order":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "promotion":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "sale":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-100 animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-[#C6080A]/5 to-orange-50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#C6080A] to-rose-600 shadow-lg shadow-red-200">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {isGerman ? "Benachrichtigungen" : "Notifications"}
              </CardTitle>
              <CardDescription className="mt-0.5">
                {isGerman
                  ? "Bleiben Sie auf dem Laufenden"
                  : "Stay updated with alerts"}
              </CardDescription>
            </div>
          </div>
          {stats.unread > 0 && (
            <span className="px-3 py-1.5 bg-[#C6080A] text-white text-xs font-bold rounded-full shadow-lg shadow-red-200">
              {stats.unread} {isGerman ? "Neu" : "New"}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Notification Detail View */}
        <AnimatePresence mode="wait">
          {selectedNotification ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {/* Back button */}
              <button
                onClick={() => setSelectedNotification(null)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#C6080A] transition-colors mb-4 group"
              >
                <ChevronRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                {isGerman
                  ? "Zurück zu Benachrichtigungen"
                  : "Back to notifications"}
              </button>

              {/* Notification content */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C6080A]/10 to-orange-100 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#C6080A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedNotification.subject}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(selectedNotification.createdAt)}
                      </p>
                    </div>
                  </div>
                  {selectedNotification.type && (
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(
                        selectedNotification.type
                      )}`}
                    >
                      {selectedNotification.type}
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: selectedNotification.context,
                    }}
                  />
                </div>

                {selectedNotification.redirectLink && (
                  <a
                    href={selectedNotification.redirectLink}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#C6080A] text-white text-sm font-medium rounded-lg hover:bg-[#a50709] transition-colors"
                  >
                    {isGerman ? "Mehr erfahren" : "Learn More"}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Filter tabs */}
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeFilter === "all"
                        ? "bg-[#C6080A] text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {isGerman ? "Alle" : "All"} ({stats.total})
                  </button>
                  <button
                    onClick={() => setActiveFilter("unread")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeFilter === "unread"
                        ? "bg-[#C6080A] text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {isGerman ? "Ungelesen" : "Unread"} ({stats.unread})
                  </button>
                </div>
              </div>

              {/* Notifications list */}
              <div className="p-4 max-h-[500px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                      <Bell className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      {activeFilter === "unread"
                        ? isGerman
                          ? "Keine ungelesenen Nachrichten"
                          : "No unread notifications"
                        : isGerman
                        ? "Keine Benachrichtigungen"
                        : "No notifications"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {isGerman
                        ? "Sie sind alle auf dem Laufenden!"
                        : "You're all caught up!"}
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredNotifications.map((notification, index) => {
                        const isUnread =
                          notification?.status?.[0]?.state === "unread" ||
                          notification?.status === "unread";

                        return (
                          <motion.div
                            key={notification._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 group hover:shadow-md ${
                              isUnread
                                ? "bg-gradient-to-r from-[#C6080A]/5 to-white border-[#C6080A]/20 hover:border-[#C6080A]/40"
                                : "bg-white border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            {/* Unread indicator */}
                            {isUnread && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C6080A] to-rose-600 rounded-l-xl" />
                            )}

                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isUnread
                                    ? "bg-[#C6080A]/10"
                                    : "bg-gray-100"
                                }`}
                              >
                                {isUnread ? (
                                  <Mail
                                    className={`w-5 h-5 ${
                                      isUnread
                                        ? "text-[#C6080A]"
                                        : "text-gray-400"
                                    }`}
                                  />
                                ) : (
                                  <MailOpen className="w-5 h-5 text-gray-400" />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4
                                    className={`font-semibold truncate ${
                                      isUnread
                                        ? "text-gray-900"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {notification.subject}
                                  </h4>
                                  {isUnread && (
                                    <span className="px-2 py-0.5 bg-[#C6080A] text-white text-[10px] font-bold rounded-full">
                                      {isGerman ? "NEU" : "NEW"}
                                    </span>
                                  )}
                                </div>

                                <p
                                  className={`text-sm line-clamp-2 ${
                                    isUnread ? "text-gray-600" : "text-gray-500"
                                  }`}
                                >
                                  {notification.context?.replace(/<[^>]*>/g, "")}
                                </p>

                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(notification.createdAt)}
                                  </span>

                                  {isUnread && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markNotificationAsRead(notification._id);
                                      }}
                                      className="flex items-center gap-1 text-xs text-[#C6080A] hover:text-[#a50709] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Check className="w-3 h-3" />
                                      {isGerman
                                        ? "Als gelesen markieren"
                                        : "Mark as read"}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Arrow */}
                              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#C6080A] group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
