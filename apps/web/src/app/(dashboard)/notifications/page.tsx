"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  Bell,
  CheckCircle,
  MessageSquare,
  Calendar,
  ClipboardList,
  Sparkles,
  Sliders,
  Check,
  Clock,
  ArrowRight,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "INQUIRY" | "BOOKING" | "INTAKE" | "AI_ACTION" | "SYSTEM";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    type: "INQUIRY",
    title: "New High-Intent Client Inquiry",
    message: "Elena Rostova submitted a contact request regarding Anxiety & Panic Support.",
    read: false,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    link: "/inquiries",
  },
  {
    id: "notif-02",
    type: "BOOKING",
    title: "Initial Consultation Confirmed",
    message: "David Miller scheduled a 15-minute phone consultation for tomorrow at 2:00 PM CT.",
    read: false,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    link: "/bookings",
  },
  {
    id: "notif-03",
    type: "INTAKE",
    title: "Clinical Intake & Consent Submitted",
    message: "Adult Clinical Intake and HIPAA consent received with electronic signature.",
    read: false,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    link: "/intake",
  },
  {
    id: "notif-04",
    type: "AI_ACTION",
    title: "AI Design Director Audit Completed",
    message: "1 layout recommendation ready for review on your Homepage hero CTA.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    link: "/website/builder",
  },
  {
    id: "notif-05",
    type: "SYSTEM",
    title: "Google Calendar Sync Successful",
    message: "Two-way calendar sync synchronized 14 practice appointment slots.",
    read: true,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    link: "/integrations",
  },
];

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "preferences">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  // Preference Toggles State
  const [prefs, setPrefs] = useState({
    emailInquiries: true,
    smsInquiries: true,
    emailBookings: true,
    smsBookings: true,
    emailIntake: true,
    emailAiActions: false,
  });

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
    } catch {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    notify.success("All Caught Up", "All notifications marked as read.");
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayedNotifications =
    activeTab === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const getTypeIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "INQUIRY":
        return <MessageSquare className="w-4 h-4 text-primary" />;
      case "BOOKING":
        return <Calendar className="w-4 h-4 text-secondary" />;
      case "INTAKE":
        return <ClipboardList className="w-4 h-4 text-success" />;
      case "AI_ACTION":
        return <Sparkles className="w-4 h-4 text-warning" />;
      default:
        return <Bell className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Notification Center"
        description="Monitor client inquiries, booking schedule confirmations, and clinical intake alerts."
        actions={
          unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Check className="w-3.5 h-3.5" />}
              onClick={handleMarkAllRead}
            >
              Mark All as Read
            </Button>
          )
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-border text-sm font-semibold gap-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          All Activity ({notifications.length})
        </button>

        <button
          onClick={() => setActiveTab("unread")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "unread"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          Unread {unreadCount > 0 && <Badge variant="primary" className="text-[10px] ml-1">{unreadCount}</Badge>}
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "preferences"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Delivery Preferences
        </button>
      </div>

      {/* ── TAB 1 & 2: NOTIFICATIONS INBOX ───────────────────────────────── */}
      {activeTab !== "preferences" && (
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden divide-y divide-border">
          {displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !notif.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-subtle"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {getTypeIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm ${!notif.read ? "font-bold text-text-primary" : "font-medium text-text-secondary"}`}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {notif.link && (
                      <>
                        <span>•</span>
                        <Link href={notif.link} className="text-primary hover:underline font-medium flex items-center gap-0.5">
                          View Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleToggleRead(notif.id)}
                className="text-[11px] text-text-muted hover:text-text-primary shrink-0 p-1"
                title={notif.read ? "Mark as unread" : "Mark as read"}
              >
                {notif.read ? "Mark Unread" : "Mark Read"}
              </button>
            </div>
          ))}

          {displayedNotifications.length === 0 && (
            <div className="p-12 text-center text-text-muted">
              <CheckCircle className="w-10 h-10 mx-auto mb-2 text-success opacity-40" />
              <p className="font-semibold text-text-primary text-sm">You're all caught up</p>
              <p className="text-xs mt-1">No unread notifications at this time.</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: DELIVERY PREFERENCES ──────────────────────────────────── */}
      {activeTab === "preferences" && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-1">Notification Alert Routing</h3>
            <p className="text-xs text-text-muted">
              Choose which channels receive clinical inquiries, schedule changes, and intake submissions.
            </p>
          </div>

          <div className="divide-y divide-border space-y-4">
            <div className="pt-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-text-primary">New Client Inquiries</div>
                <div className="text-[11px] text-text-muted">When a prospective client sends a message from the website contact form.</div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.emailInquiries}
                    onChange={(e) => setPrefs({ ...prefs, emailInquiries: e.target.checked })}
                    className="rounded text-primary"
                  />
                  Email
                </label>
                <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.smsInquiries}
                    onChange={(e) => setPrefs({ ...prefs, smsInquiries: e.target.checked })}
                    className="rounded text-primary"
                  />
                  SMS
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-text-primary">Appointment Bookings & Cancellations</div>
                <div className="text-[11px] text-text-muted">When a client schedules or cancels a consultation or recurring session.</div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.emailBookings}
                    onChange={(e) => setPrefs({ ...prefs, emailBookings: e.target.checked })}
                    className="rounded text-primary"
                  />
                  Email
                </label>
                <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.smsBookings}
                    onChange={(e) => setPrefs({ ...prefs, smsBookings: e.target.checked })}
                    className="rounded text-primary"
                  />
                  SMS
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-text-primary">Clinical Intake Submissions</div>
                <div className="text-[11px] text-text-muted">Alert staff immediately when pre-session clinical paperwork is completed.</div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.emailIntake}
                    onChange={(e) => setPrefs({ ...prefs, emailIntake: e.target.checked })}
                    className="rounded text-primary"
                  />
                  Email
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => notify.success("Preferences Saved", "Alert delivery routes updated.")}
            >
              Save Preferences
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
