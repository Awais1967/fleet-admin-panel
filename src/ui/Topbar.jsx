// src/ui/Topbar.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import Avatar from "../components/shared/Avatar";
import { useAuth } from "../context/AuthContext";
import * as notificationsService from "../services/notifications.service";

const PRIMARY = "#0A8F86";

export default function Topbar({ title = "", onOpenMobileNav }) {
  const { user } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState(
    notificationsService.getStoredReadNotificationIds,
  );
  const notifRef = useRef(null);
  const lang = useMemo(() => "English", []);

  useEffect(() => {
    function onDocClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    return notificationsService.subscribeDamageDetectedNotifications(
      (items) => setNotifications(items),
      () => setNotifications([]),
    );
  }, []);

  useEffect(() => {
    if (!user?.id) return undefined;

    return notificationsService.subscribeReadNotificationIds(
      user.id,
      (ids) => {
        const next = new Set(ids);
        setReadNotificationIds(next);
      },
      () => {},
    );
  }, [user?.id]);

  const displayNotifications = useMemo(
    () =>
      notifications.map((notification) => ({
        ...notification,
        unread: !readNotificationIds.has(notification.id),
      })),
    [notifications, readNotificationIds],
  );

  const unreadCount = displayNotifications.filter((n) => n.unread).length;

  function markRead(notificationIds) {
    const ids = notificationIds.filter(Boolean);
    if (!ids.length) return;

    setReadNotificationIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });

    notificationsService.markNotificationsRead(user?.id, ids).catch(() => {});
  }

  function markAllRead() {
    markRead(notifications.map((n) => n.id));
  }

  return (
    // Fixed to top so it remains visible; on large screens start after the sidebar
    <header className="h-18 bg-white border-b border-app flex items-center px-4 sm:px-6 fixed top-0 left-0 right-0 z-30 lg:left-60">
      {/* mobile menu button */}
      <button
        onClick={onOpenMobileNav}
        className="lg:hidden h-10 w-10 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center mr-3"
        aria-label="Open menu"
      >
        <FiMenu />
      </button>

      {/* page title */}
      <div className="text-xl font-semibold text-slate-900">{title}</div>

      <div className="ml-auto flex items-center gap-3">
        {/* language */}
        <div className="relative">
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="h-10 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm text-slate-700 flex items-center gap-2"
          >
            <span>{lang}</span>
            <FiChevronDown className="text-slate-400" />
          </button>

          {langOpen ? (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-app rounded-xl shadow-lg overflow-hidden z-50">
              {["English", "Deutsch", "Français"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLangOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50"
                >
                  {l}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative h-10 w-10 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <FiBell />
            {unreadCount > 0 ? (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-600 rounded-full">
                {unreadCount}
              </span>
            ) : null}
          </button>

          {notifOpen ? (
            <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white border border-app rounded-xl shadow-lg overflow-hidden z-50">
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ backgroundColor: `${PRIMARY}15` }}
              >
                <div
                  className="text-sm font-semibold"
                  style={{ color: PRIMARY }}
                >
                  Notifications
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllRead}
                    className="text-xs hover:text-opacity-80 transition"
                    style={{ color: PRIMARY }}
                  >
                    Mark all read
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-72">
                {displayNotifications.map((n) => (
                  <Link
                    to={n.to || "/notifications"}
                    key={n.id}
                    onClick={() => {
                      markRead([n.id]);
                      setNotifOpen(false);
                    }}
                    className={`block px-4 py-3 text-sm transition border-b`}
                    style={{
                      backgroundColor: n.unread
                        ? `${PRIMARY}10`
                        : "transparent",
                      borderColor: `${PRIMARY}20`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-slate-900">
                            {n.title}
                          </div>
                          <div className="text-xs text-slate-400">{n.time}</div>
                        </div>
                        <div className="text-slate-600 text-sm mt-1">
                          {n.body}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {!displayNotifications.length ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    No AI damage alerts.
                  </div>
                ) : null}
              </div>

              <div
                className="px-4 py-2 transition"
                style={{ backgroundColor: `${PRIMARY}08` }}
              >
                <Link
                  to="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="font-medium transition hover:opacity-80"
                  style={{ color: PRIMARY }}
                >
                  View all
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* user */}
        <div className="flex items-center gap-2">
          <Avatar name="Alex" size={34} />
        </div>
      </div>
    </header>
  );
}
