"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Video,
  CheckCircle2,
  Circle,
  FileText,
  Smile,
  Shield,
  PhoneCall,
  Loader2,
  Download,
  Leaf,
  Clock,
  Send,
  AlertCircle,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

export default function ClientPortalPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mood form state
  const [moodRating, setMoodRating] = useState(7);
  const [anxietyLevel, setAnxietyLevel] = useState(4);
  const [moodNote, setMoodNote] = useState("");
  const [isSubmittingMood, setIsSubmittingMood] = useState(false);

  const fetchPortalData = async () => {
    try {
      const res = await fetch("/api/portal");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch {
      notify.error("Failed to load portal data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  const handleToggleHomework = async (hwId: string) => {
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_HOMEWORK", homeworkId: hwId }),
      });
      const json = await res.json();
      if (json.success) {
        notify.success("Homework status updated!");
        fetchPortalData();
      }
    } catch {
      notify.error("Failed to update homework");
    }
  };

  const handleLogMood = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingMood(true);
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "LOG_MOOD",
          moodRating,
          anxietyLevel,
          note: moodNote,
        }),
      });
      const json = await res.json();
      if (json.success) {
        notify.success("Today's mood check-in logged for your therapist!");
        setMoodNote("");
        fetchPortalData();
      }
    } catch {
      notify.error("Failed to log mood");
    } finally {
      setIsSubmittingMood(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Portal Top Bar */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="font-serif font-bold text-lg text-foreground">
              Willow & Mind Therapy · Client Portal
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground hidden sm:inline">
              Welcome, <strong>{data?.user?.name || "Elena Rodriguez"}</strong>
            </span>
            <Link
              href="/"
              className="px-3 py-1.5 border border-border rounded text-muted-foreground hover:text-foreground"
            >
              Exit to Website
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Urgent Lifeline Bar */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>
              If you are in immediate distress or crisis, please call or text <strong>988</strong> (24/7 National Lifeline).
            </span>
          </div>
          <a
            href="tel:988"
            className="px-2.5 py-1 bg-red-600 text-white font-semibold rounded hover:bg-red-700 whitespace-nowrap text-[11px]"
          >
            Call 988
          </a>
        </div>

        {/* 1. Next Appointment Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Session</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground">
              {data?.upcomingBooking?.service?.name || "Individual CBT Psychotherapy"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Tuesday, Oct 6 at 2:00 PM CST · 50 Minutes with <strong>Dr. Sarah Bennett</strong>
            </p>
          </div>

          <Link
            href="/telehealth/session-elena-01"
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md text-sm text-center"
          >
            <Video className="w-4 h-4" />
            <span>Join Telehealth Video Session</span>
          </Link>
        </div>

        {/* Two Columns: Homework + Mood Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Homework Tracker */}
          <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Assigned Therapeutic Homework
              </h3>
              <span className="text-[11px] text-muted-foreground">
                CBT Protocol
              </span>
            </div>

            <div className="space-y-3">
              {(data?.user?.assignedHomework || []).map((hw: any) => (
                <div
                  key={hw.id}
                  onClick={() => handleToggleHomework(hw.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    hw.completed
                      ? "bg-muted/40 border-border opacity-70"
                      : "bg-background border-primary/30 hover:border-primary shadow-xs"
                  }`}
                >
                  <button className="mt-0.5 text-primary">
                    {hw.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1 text-xs">
                    <p className={`font-semibold ${hw.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {hw.title}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-[11px]">
                      {hw.description}
                    </p>
                    <span className="inline-block mt-1 font-mono text-[10px] text-muted-foreground">
                      Due: {hw.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Mood & Anxiety Tracker */}
          <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Smile className="w-4 h-4 text-primary" />
                Daily Mood & Anxiety Check-In
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Shares with Dr. Bennett
              </span>
            </div>

            <form onSubmit={handleLogMood} className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-medium text-foreground mb-1">
                  <span>Overall Mood Rating (1 - Low, 10 - Excellent)</span>
                  <span className="font-bold text-primary">{moodRating} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodRating}
                  onChange={(e) => setMoodRating(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium text-foreground mb-1">
                  <span>Anxiety Level (1 - None, 10 - Severe Panic)</span>
                  <span className="font-bold text-purple-600">{anxietyLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={anxietyLevel}
                  onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <label className="font-medium text-foreground">
                  Quick Note for Session (Triggers, Victories, or Thoughts)
                </label>
                <textarea
                  rows={2}
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="e.g. Practiced breathing today; noticed anxiety spike before team standup..."
                  className="w-full mt-1 p-2 bg-background border border-input rounded text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingMood}
                className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm text-xs"
              >
                {isSubmittingMood ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Log Check-In
              </button>
            </form>
          </div>
        </div>

        {/* 3. My Insurance Superbills & Invoices */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Insurance Superbills & Reimbursement Receipts
            </h3>
            <span className="text-[11px] text-muted-foreground">
              Download and submit to your insurance company for 60%–80% reimbursement
            </span>
          </div>

          <div className="divide-y divide-border">
            {(data?.superbills || []).length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No superbills issued yet.
              </p>
            ) : (
              (data?.superbills || []).map((sb: any) => (
                <div key={sb.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-foreground">{sb.invoiceNumber}</span>
                    <p className="text-muted-foreground text-[11px]">
                      {new Date(sb.serviceDate).toLocaleDateString()} · CPT {sb.procedureCode} · {sb.procedureDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground">${sb.amount.toFixed(2)}</span>
                    <button
                      onClick={() => notify.success(`Superbill ${sb.invoiceNumber} PDF downloaded!`)}
                      className="px-3 py-1.5 bg-muted border border-border rounded hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <Download className="w-3 h-3" /> Download Superbill PDF
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
