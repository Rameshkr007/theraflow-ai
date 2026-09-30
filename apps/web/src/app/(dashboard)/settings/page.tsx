"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Globe,
  Clock,
  Shield,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

export default function GeneralSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    timezone: "America/Chicago (Central Time)",
    locale: "English (US)",
    currency: "USD ($)",
    appointmentRemindersSms: true,
    appointmentRemindersEmail: true,
    hipaaNoticeUrl: "https://willowmindtherapy.com/hipaa-privacy",
    analyticsConsentRequired: true,
    telehealthAutoRecord: false,
    requireCrisisAgreement: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      notify.success("Practice configuration settings saved successfully!");
    }, 600);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            General Practice Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            System regional settings, patient notification rules, and HIPAA compliance policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Regional & Localization */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2.5">
            <Globe className="w-4 h-4 text-primary" />
            Regional & Localization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-foreground">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              >
                <option value="America/Chicago (Central Time)">America/Chicago (CST)</option>
                <option value="America/New_York (Eastern Time)">America/New_York (EST)</option>
                <option value="America/Denver (Mountain Time)">America/Denver (MST)</option>
                <option value="America/Los_Angeles (Pacific Time)">America/Los_Angeles (PST)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-foreground">Language / Locale</label>
              <select
                value={settings.locale}
                onChange={(e) => setSettings({ ...settings, locale: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish (US)">Español (US)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-foreground">Billing Currency</label>
              <input
                type="text"
                disabled
                value={settings.currency}
                className="w-full mt-1.5 p-2 bg-muted border border-input rounded-md text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Automated Reminders */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2.5">
            <Bell className="w-4 h-4 text-primary" />
            Automated Client Notifications
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appointmentRemindersSms}
                onChange={(e) => setSettings({ ...settings, appointmentRemindersSms: e.target.checked })}
                className="w-4 h-4 accent-primary rounded"
              />
              <div>
                <span className="font-semibold text-foreground">Send SMS Reminders 24 Hours Prior to Session</span>
                <p className="text-muted-foreground text-[11px]">Reduces appointment no-shows by up to 40%</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appointmentRemindersEmail}
                onChange={(e) => setSettings({ ...settings, appointmentRemindersEmail: e.target.checked })}
                className="w-4 h-4 accent-primary rounded"
              />
              <div>
                <span className="font-semibold text-foreground">Send Email Calendar Invites with Telehealth Room Link</span>
                <p className="text-muted-foreground text-[11px]">Includes secure 1-click meeting join URL</p>
              </div>
            </label>
          </div>
        </div>

        {/* Compliance & Privacy */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2.5">
            <Shield className="w-4 h-4 text-primary" />
            Compliance & Legal Policies
          </h3>

          <div>
            <label className="font-medium text-foreground">Public Notice of Privacy Practices (NPP) URL</label>
            <input
              type="url"
              value={settings.hipaaNoticeUrl}
              onChange={(e) => setSettings({ ...settings, hipaaNoticeUrl: e.target.value })}
              className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
            />
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireCrisisAgreement}
                onChange={(e) => setSettings({ ...settings, requireCrisisAgreement: e.target.checked })}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="font-medium text-foreground">
                Require 988 emergency crisis agreement confirmation on all client intake forms
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
