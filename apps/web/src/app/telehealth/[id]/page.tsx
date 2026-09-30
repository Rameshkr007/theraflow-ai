"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share2,
  Clock,
  ShieldCheck,
  FileText,
  Sparkles,
  User,
  Lock,
  ChevronRight,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

export default function TelehealthRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Media Controls
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Timer
  const [seconds, setSeconds] = useState(2840); // 47:20 in session

  // Clinician live notepad
  const [sessionNotes, setSessionNotes] = useState(
    "Client (Elena) reports doing 4-7-8 breathing before executive meeting. Prevented panic attack. Discussed cognitive distortions around upcoming performance review. Assigned 3 thought records examining catastrophizing."
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndSessionAndConvert = () => {
    notify.success("Telehealth session concluded. Transferring in-session notes to AI Scribe...");
    // Save draft or pass to clinical notes
    sessionStorage.setItem("theraflow_telehealth_notes", sessionNotes);
    router.push("/clinical/notes");
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Telehealth Top Navigation Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-serif font-bold text-sm tracking-wide">
            TheraFlow Telehealth Secure Suite
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 font-mono text-slate-400">
            Room: {params.id}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
            <Lock className="w-3 h-3" /> End-to-End Encrypted
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-sm bg-slate-800/80 px-3 py-1 rounded-md border border-slate-700">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{formatTimer(seconds)}</span>
            <span className="text-slate-400 text-xs">/ 50:00 (CPT 90834)</span>
          </div>

          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Video Streams */}
        <div className="lg:col-span-8 p-4 flex flex-col justify-between relative bg-slate-950">
          {/* Main Video: Client */}
          <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner">
            {videoOn ? (
              <div className="text-center space-y-3">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-emerald-400 mx-auto flex items-center justify-center text-white text-3xl font-serif font-bold shadow-lg">
                  ER
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-lg text-slate-200">Elena Rodriguez</p>
                  <p className="text-xs text-slate-400 font-mono">1080p WebRTC High-Definition Feed · Austin, TX</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500">
                <VideoOff className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs">Camera feed muted</p>
              </div>
            )}

            {/* Clinician Picture-in-Picture */}
            <div className="absolute top-4 right-4 w-48 h-32 rounded-xl bg-slate-800/90 border border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-slate-700 mx-auto flex items-center justify-center text-xs font-bold text-slate-300 mb-1">
                  SB
                </div>
                <p className="text-[11px] font-semibold text-slate-300">Dr. Sarah Bennett</p>
                <p className="text-[9px] text-emerald-400">Clinician (You)</p>
              </div>
            </div>

            {/* Bottom Left Status */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HIPAA Compliant Video Pipeline</span>
            </div>
          </div>

          {/* Bottom Floating Control Dock */}
          <div className="h-16 flex items-center justify-center gap-4 mt-3">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3.5 rounded-full transition-colors ${
                micOn ? "bg-slate-800 hover:bg-slate-700 text-slate-200" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-3.5 rounded-full transition-colors ${
                videoOn ? "bg-slate-800 hover:bg-slate-700 text-slate-200" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setIsScreenSharing(!isScreenSharing);
                notify.info(isScreenSharing ? "Screen sharing ended" : "Screen sharing active");
              }}
              className={`p-3.5 rounded-full transition-colors ${
                isScreenSharing ? "bg-primary text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleEndSessionAndConvert}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full flex items-center gap-2 shadow-lg transition-colors text-sm"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End & Generate SOAP Note</span>
            </button>
          </div>
        </div>

        {/* Right Side: Live In-Session Confidential Notepad */}
        <div className="lg:col-span-4 bg-slate-900 border-l border-slate-800 flex flex-col justify-between p-4 overflow-hidden">
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-xs text-slate-200">
                  Live In-Session Clinical Pad
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Auto-saves to Scribe
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Notes taken here are confidential and never shown to the client. When you end the call, these automatically feed into the AI Scribe for instant SOAP generation.
            </p>

            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="flex-1 w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="Jot down client quotes, emotional shifts, homework progress, automatic thoughts, or risk factors during the session..."
            />
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={handleEndSessionAndConvert}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Convert Notes to AI SOAP Record</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              Target CPT 90834 · Diagnoses F41.1 / F43.22
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
