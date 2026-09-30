"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Shield,
  Clock,
  Save,
  CheckCircle2,
  Stethoscope,
  Globe,
  Loader2,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

export default function PracticeProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "Willow & Mind Therapy",
    tagline: "Evidence-Based Psychotherapy for High-Achievers & Couples",
    email: "contact@willowmindtherapy.com",
    phone: "(512) 555-0190",
    address: "1204 San Antonio St, Suite 200, Austin, TX 78701",
    npi: "1841920394",
    taxId: "84-2910394",
    licenseNumber: "Texas BHEC LPC #78291",
    statesLicensed: "Texas, California (Telehealth Only)",
    officeHours: "Monday – Friday: 9:00 AM – 6:00 PM CST",
    cancellationWindowHours: 48,
    defaultSessionFee: 175,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      notify.success("Practice profile & clinical credentials saved successfully!");
    }, 600);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Practice Profile & Credentials
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Verified Practice
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your clinical identity, licensure, physical office, and legal billing information.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Practice Identity */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2.5">
            <Building2 className="w-4 h-4 text-primary" />
            Practice Identity & Public Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-foreground">Practice Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              />
            </div>
            <div>
              <label className="font-medium text-foreground">Tagline / Subheading</label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              />
            </div>
            <div>
              <label className="font-medium text-foreground">Contact Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              />
            </div>
            <div>
              <label className="font-medium text-foreground">Primary Practice Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-medium text-foreground">Physical Office Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Clinical Licensure & Billing Identifiers */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2.5">
            <Stethoscope className="w-4 h-4 text-primary" />
            Clinical Licensure & Billing Credentials (NPI / Tax ID)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-foreground">National Provider Identifier (NPI)</label>
              <input
                type="text"
                value={profile.npi}
                onChange={(e) => setProfile({ ...profile, npi: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md font-mono"
              />
              <span className="text-[10px] text-muted-foreground">Appears automatically on CMS-1500 Superbills</span>
            </div>
            <div>
              <label className="font-medium text-foreground">Federal Tax ID / EIN</label>
              <input
                type="text"
                value={profile.taxId}
                onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md font-mono"
              />
              <span className="text-[10px] text-muted-foreground">Used for insurance claim processing</span>
            </div>
            <div>
              <label className="font-medium text-foreground">Board Licensure / Registration</label>
              <input
                type="text"
                value={profile.licenseNumber}
                onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              />
            </div>
            <div>
              <label className="font-medium text-foreground">Licensed Jurisdiction States</label>
              <input
                type="text"
                value={profile.statesLicensed}
                onChange={(e) => setProfile({ ...profile, statesLicensed: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Scheduling & Cancellation Policy */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2.5">
            <Clock className="w-4 h-4 text-primary" />
            Operating Hours & Policies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-foreground">Standard Hours of Operation</label>
              <input
                type="text"
                value={profile.officeHours}
                onChange={(e) => setProfile({ ...profile, officeHours: e.target.value })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              />
            </div>
            <div>
              <label className="font-medium text-foreground">Cancellation Window</label>
              <select
                value={profile.cancellationWindowHours}
                onChange={(e) => setProfile({ ...profile, cancellationWindowHours: Number(e.target.value) })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              >
                <option value={24}>24 Hours Notice</option>
                <option value={48}>48 Hours Notice (Recommended)</option>
                <option value={72}>72 Hours Notice</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-foreground">Default 50m Session Fee ($)</label>
              <input
                type="number"
                value={profile.defaultSessionFee}
                onChange={(e) => setProfile({ ...profile, defaultSessionFee: Number(e.target.value) })}
                className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
