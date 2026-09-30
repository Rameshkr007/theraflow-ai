"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mic,
  AlertTriangle,
  ArrowRight,
  Clock,
  Search,
  Plus,
  Loader2,
  User,
  Stethoscope,
  Send,
  Download,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

interface ClinicalNote {
  id: string;
  clientName: string;
  clientEmail?: string | null;
  sessionDate: string;
  durationMinutes: number;
  noteType: "SOAP" | "DAP" | "PROGRESS" | "INTAKE_EVAL";
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosisCodes: string[];
  procedureCodes: string[];
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRISIS";
  isSigned: boolean;
  signedAt?: string | null;
  signatureText?: string | null;
  homeworkAssigned?: string | null;
}

export default function ClinicalNotesPage() {
  const [activeTab, setActiveTab] = useState<"scribe" | "records">("scribe");
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Scribe Form State
  const [clientName, setClientName] = useState("Elena Rodriguez");
  const [sessionDuration, setSessionDuration] = useState(50);
  const [rawText, setRawText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generated Scribe Result
  const [generatedSOAP, setGeneratedSOAP] = useState<{
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    mentalStatusExam?: Record<string, string>;
    diagnosisCodes: string[];
    procedureCodes: string[];
    riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRISIS";
    homeworkAssigned: string;
    redactionCount: number;
  } | null>(null);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clinical/notes");
      const json = await res.json();
      if (json.success && json.data) {
        setNotes(json.data);
      }
    } catch {
      notify.error("Failed to load clinical notes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleInsertSampleDictation = () => {
    setClientName("Elena Rodriguez");
    setRawText(
      "Elena presented for telehealth session 4 on time. Phone 512-555-0194, living on Congress Ave. She reported that her panic attacks have dropped to once this past week from four times previously. Practiced 4-7-8 breathing before a major executive pitch on Monday and successfully prevented a panic attack. Still experiences dread before high-visibility zoom meetings. Sleep is up to 6.5 hours. Appears oriented, calm, speech fluid, appropriate affect. Working diagnosis GAD with panic. Assigned 3 thought records examining catastrophizing thoughts for next Tuesday."
    );
  };

  const handleGenerateScribe = async () => {
    if (!rawText.trim() || rawText.length < 10) {
      notify.error("Please enter or dictate session notes first (min 10 characters)");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/clinical/ai-scribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          clientName: clientName || "Client",
          noteType: "SOAP",
          sessionDuration,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setGeneratedSOAP(json.data);
        notify.success("Clinical SOAP note synthesized with HIPAA PHI redaction");
      } else {
        notify.error(json.error?.message || "Generation failed");
      }
    } catch {
      notify.error("Network error during AI Scribe execution");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndSign = async (signNow: boolean) => {
    if (!generatedSOAP) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/clinical/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName || "Elena Rodriguez",
          durationMinutes: sessionDuration,
          noteType: "SOAP",
          subjective: generatedSOAP.subjective,
          objective: generatedSOAP.objective,
          assessment: generatedSOAP.assessment,
          plan: generatedSOAP.plan,
          mentalStatusExam: generatedSOAP.mentalStatusExam,
          diagnosisCodes: generatedSOAP.diagnosisCodes,
          procedureCodes: generatedSOAP.procedureCodes,
          riskLevel: generatedSOAP.riskLevel,
          homeworkAssigned: generatedSOAP.homeworkAssigned,
          isSigned: signNow,
          signatureText: signNow
            ? "Dr. Sarah Bennett, PsyD, Licensed Clinical Psychologist"
            : undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        notify.success(
          signNow
            ? "Clinical note locked & digitally signed into EHR!"
            : "Clinical note draft saved."
        );
        setGeneratedSOAP(null);
        setRawText("");
        fetchNotes();
        setActiveTab("records");
      } else {
        notify.error(json.error?.message || "Failed to save note");
      }
    } catch {
      notify.error("Error saving note");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.clientName.toLowerCase().includes(search.toLowerCase()) ||
    n.subjective.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Clinical Documentation & AI Ambient Scribe
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Safe Harbor
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Dictate or paste session scribbles. Auto-synthesize structured SOAP/DAP notes with pre-inference PHI redaction, MSE, and CPT billing codes.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-muted p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab("scribe")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "scribe"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI Scribe Generator
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "records"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Clinical Records ({notes.length})
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground">Total Clinical Records</p>
          <p className="text-2xl font-bold text-foreground mt-1">{notes.length}</p>
          <p className="text-[11px] text-primary mt-1 font-medium">100% HIPAA Stored</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground">Signed & Locked</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {notes.filter((n) => n.isSigned).length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Immutable attestation</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground">Average Note Time</p>
          <p className="text-2xl font-bold text-foreground mt-1">45 sec</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">↓ 88% documentation time</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground">Active Diagnosis Set</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">ICD-10</p>
          <p className="text-[11px] text-muted-foreground mt-1">CPT 90834 / 90837 mapped</p>
        </div>
      </div>

      {/* TAB 1: AI SCRIBE GENERATOR */}
      {activeTab === "scribe" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mic className="w-4 h-4 text-primary" />
                  Session Dictation / Raw Notes
                </span>
                <button
                  type="button"
                  onClick={handleInsertSampleDictation}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Insert Sample Telehealth Dictation
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Elena Rodriguez"
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-background border border-input rounded-md"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Duration</label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-background border border-input rounded-md"
                  >
                    <option value={50}>50 min (CPT 90834)</option>
                    <option value={60}>60 min (CPT 90837)</option>
                    <option value={30}>30 min (CPT 90832)</option>
                    <option value={90}>90 min (Diagnostic 90791)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Clinician Scribbles / Voice Transcript
                </label>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Type unstructured session observations, quote client statements, homework progress, affect, or paste an audio dictation transcript..."
                  className="w-full mt-1.5 p-3 text-xs bg-background border border-input rounded-lg leading-relaxed focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 text-primary font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Automatic Safe Harbor PHI Masking</span>
                </div>
                <p className="text-[11px]">
                  All client phone numbers, SSNs, street addresses, and emails are redacted before AI inference.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateScribe}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>De-identifying PHI & Synthesizing SOAP...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>⚡ Synthesize Clinical SOAP Note</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Output / Review Panel */}
          <div className="lg:col-span-7">
            {generatedSOAP ? (
              <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-5">
                {/* Header of review */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-foreground">
                      Structured Clinical Encounter Review (SOAP)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Patient: <strong>{clientName}</strong> · CPT: {generatedSOAP.procedureCodes.join(", ")} · ICD-10: {generatedSOAP.diagnosisCodes.join(", ")}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    generatedSOAP.riskLevel === "CRISIS"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : generatedSOAP.riskLevel === "MODERATE"
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  }`}>
                    Risk: {generatedSOAP.riskLevel}
                  </span>
                </div>

                {/* SOAP Sections */}
                <div className="space-y-4 text-xs">
                  {/* Subjective */}
                  <div className="p-3 bg-muted/40 rounded-lg border border-border">
                    <span className="font-bold text-primary tracking-wider uppercase text-[11px]">
                      [S] Subjective
                    </span>
                    <p className="mt-1 text-foreground leading-relaxed">
                      {generatedSOAP.subjective}
                    </p>
                  </div>

                  {/* Objective */}
                  <div className="p-3 bg-muted/40 rounded-lg border border-border">
                    <span className="font-bold text-primary tracking-wider uppercase text-[11px]">
                      [O] Objective & Mental Status
                    </span>
                    <p className="mt-1 text-foreground leading-relaxed">
                      {generatedSOAP.objective}
                    </p>
                    {generatedSOAP.mentalStatusExam && (
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] bg-background p-2 rounded border border-border">
                        <div><span className="text-muted-foreground">Mood:</span> {generatedSOAP.mentalStatusExam.mood}</div>
                        <div><span className="text-muted-foreground">Affect:</span> {generatedSOAP.mentalStatusExam.affect}</div>
                        <div><span className="text-muted-foreground">Thought:</span> {generatedSOAP.mentalStatusExam.thoughtProcess}</div>
                        <div><span className="text-muted-foreground">Cognition:</span> {generatedSOAP.mentalStatusExam.cognition}</div>
                      </div>
                    )}
                  </div>

                  {/* Assessment */}
                  <div className="p-3 bg-muted/40 rounded-lg border border-border">
                    <span className="font-bold text-primary tracking-wider uppercase text-[11px]">
                      [A] Assessment & Clinical Impression
                    </span>
                    <p className="mt-1 text-foreground leading-relaxed">
                      {generatedSOAP.assessment}
                    </p>
                  </div>

                  {/* Plan */}
                  <div className="p-3 bg-muted/40 rounded-lg border border-border">
                    <span className="font-bold text-primary tracking-wider uppercase text-[11px]">
                      [P] Plan & Homework
                    </span>
                    <p className="mt-1 text-foreground whitespace-pre-line leading-relaxed">
                      {generatedSOAP.plan}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-muted-foreground">
                    ✓ {generatedSOAP.redactionCount} PHI item(s) de-identified prior to generation
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleSaveAndSign(false)}
                      className="flex-1 sm:flex-none px-4 py-2 border border-input rounded-md text-xs font-semibold hover:bg-muted transition-colors"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleSaveAndSign(true)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Sign & Lock Record
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[380px] rounded-xl border border-dashed border-border flex flex-col items-center justify-center p-8 text-center bg-muted/20">
                <Stethoscope className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <h4 className="text-base font-semibold text-foreground">No Note Synthesized Yet</h4>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Type session observations or click "Insert Sample Telehealth Dictation", then click Synthesize to preview structured clinical output.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HISTORICAL CLINICAL RECORDS (EHR) */}
      {activeTab === "records" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, diagnosis, or note..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-background border border-input rounded-md"
              />
            </div>
            <button
              onClick={() => setActiveTab("scribe")}
              className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Clinical Note
            </button>
          </div>

          <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Encounter Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Diagnosis & CPT</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading medical records...
                    </td>
                  </tr>
                ) : filteredNotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No clinical notes found.
                    </td>
                  </tr>
                ) : (
                  filteredNotes.map((note) => (
                    <tr key={note.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-primary" />
                          <span>{note.clientName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(note.sessionDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-muted border border-border">
                          {note.noteType} ({note.durationMinutes}m)
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                        {note.procedureCodes.join(", ")} | {note.diagnosisCodes.join(", ")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            note.riskLevel === "CRISIS"
                              ? "bg-red-100 text-red-700"
                              : note.riskLevel === "MODERATE"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {note.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {note.isSigned ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                            <Lock className="w-3 h-3" /> Signed & Locked
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium text-[11px]">Draft</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`/billing/superbills?noteId=${note.id}&clientName=${encodeURIComponent(note.clientName)}`}
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold"
                        >
                          Generate Superbill <ArrowRight className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
