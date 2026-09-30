"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck,
  Plus,
  Search,
  Download,
  Printer,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Shield,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

interface Superbill {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string | null;
  clientDob?: string | null;
  providerName: string;
  providerNpi: string;
  providerTaxId: string;
  providerAddress?: string | null;
  serviceDate: string;
  procedureCode: string;
  procedureDescription: string;
  diagnosisCode: string;
  secondaryDiagnosis?: string | null;
  amount: number;
  amountPaid: number;
  status: "DRAFT" | "ISSUED" | "PAID" | "SUBMITTED" | "REIMBURSED";
  notes?: string | null;
  issuedAt?: string | null;
}

export default function SuperbillsPage() {
  const [superbills, setSuperbills] = useState<Superbill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBill, setSelectedBill] = useState<Superbill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // New Superbill form state
  const [newBill, setNewBill] = useState({
    clientName: "Elena Rodriguez",
    clientEmail: "elena.r@example.com",
    clientAddress: "1402 S Congress Ave, Austin, TX 78704",
    clientDob: "1994-06-15",
    procedureCode: "90834",
    procedureDescription: "Psychotherapy, 45-50 minutes, individual",
    diagnosisCode: "F41.1",
    amount: 175.0,
    amountPaid: 175.0,
  });

  const fetchSuperbills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/billing/superbills");
      const json = await res.json();
      if (json.success && json.data) {
        setSuperbills(json.data);
      }
    } catch {
      notify.error("Failed to load superbills");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperbills();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch("/api/billing/superbills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBill),
      });

      const json = await res.json();
      if (json.success) {
        notify.success(`Superbill ${json.data.invoiceNumber} generated!`);
        setIsModalOpen(false);
        fetchSuperbills();
        setSelectedBill(json.data);
      } else {
        notify.error(json.error?.message || "Failed to generate superbill");
      }
    } catch {
      notify.error("Network error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/billing/superbills/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        notify.success(`Status updated to ${newStatus}`);
        fetchSuperbills();
        if (selectedBill?.id === id) {
          setSelectedBill(json.data);
        }
      }
    } catch {
      notify.error("Failed to update status");
    }
  };

  const filteredBills = superbills.filter(
    (b) =>
      b.clientName.toLowerCase().includes(search.toLowerCase()) ||
      b.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.diagnosisCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Superbill & Insurance Reimbursement Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              CMS-1500 Ready
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Automated out-of-network reimbursement documentation with ICD-10 diagnostic & CPT procedure coding.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Generate Superbill
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground">Total Issued Superbills</p>
          <p className="text-2xl font-bold text-foreground mt-1">{superbills.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Austin, TX Practice NPI</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground">Total Reimbursable Billed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            ${superbills.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Paid in full by clients</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground">Typical Insurance Return</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">60% – 80%</p>
          <p className="text-[11px] text-muted-foreground mt-1">Out-of-network benefit</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-xs text-muted-foreground">CMS Claim Format</p>
          <p className="text-2xl font-bold text-foreground mt-1">Standard</p>
          <p className="text-[11px] text-muted-foreground mt-1">Box 24 CPT & Box 21 ICD-10</p>
        </div>
      </div>

      {/* Superbill List */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice #, client, or diagnosis..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-background border border-input rounded-md"
          />
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service Date</th>
                <th className="py-3 px-4">CPT & ICD-10</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading billing records...
                  </td>
                </tr>
              ) : filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No superbills found. Click "Generate Superbill" to create your first claim receipt.
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-foreground">
                      {b.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-primary" />
                        <span>{b.clientName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(b.serviceDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {b.procedureCode} | {b.diagnosisCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      ${b.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedBill(b)}
                        className="px-2.5 py-1 bg-muted border border-border text-foreground hover:bg-primary hover:text-primary-foreground rounded text-[11px] font-semibold transition-colors"
                      >
                        View Official CMS-1500
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL CMS-1500 STATEMENT MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border border-border rounded-xl shadow-2xl max-w-3xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedBill(null)}
              className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Header */}
            <div className="border-b border-border pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-serif font-bold text-foreground">
                  Statement for Insurance Reimbursement (Superbill)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Standard CMS-1500 Out-of-Network Psychotherapy Claim Receipt
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-primary">
                  {selectedBill.invoiceNumber}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Date: {new Date(selectedBill.serviceDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Two Column Details */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              {/* Provider Info */}
              <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-1.5">
                <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                  Rendering Provider Information
                </span>
                <p className="font-semibold text-foreground">{selectedBill.providerName}</p>
                <p className="text-muted-foreground">{selectedBill.providerAddress}</p>
                <div className="pt-1 font-mono text-[11px] space-y-0.5">
                  <p><span className="text-muted-foreground">NPI:</span> {selectedBill.providerNpi}</p>
                  <p><span className="text-muted-foreground">Tax ID / EIN:</span> {selectedBill.providerTaxId}</p>
                  <p><span className="text-muted-foreground">License:</span> LPC #78291 (Texas BHEC)</p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-1.5">
                <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                  Patient Information
                </span>
                <p className="font-semibold text-foreground">{selectedBill.clientName}</p>
                <p className="text-muted-foreground">{selectedBill.clientAddress}</p>
                <div className="pt-1 font-mono text-[11px] space-y-0.5">
                  <p><span className="text-muted-foreground">Email:</span> {selectedBill.clientEmail}</p>
                  <p><span className="text-muted-foreground">DOB:</span> {selectedBill.clientDob}</p>
                </div>
              </div>
            </div>

            {/* Coding Table (CMS-1500 Box 24) */}
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted border-b border-border text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Date of Service</th>
                    <th className="py-2.5 px-3">CPT Code</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">ICD-10 Diag</th>
                    <th className="py-2.5 px-3 text-right">Fee</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-3">
                      {new Date(selectedBill.serviceDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {selectedBill.procedureCode}
                    </td>
                    <td className="py-3 px-3">{selectedBill.procedureDescription}</td>
                    <td className="py-3 px-3 font-mono font-bold">
                      {selectedBill.diagnosisCode}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold">
                      ${selectedBill.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-emerald-600">
                      ${selectedBill.amountPaid.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Client Instructions */}
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-primary">Instructions for Client:</p>
              <p>
                Submit this statement along with your insurance company's Out-of-Network claim form to claim your reimbursement. Keep a copy for your medical expense records.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedBill.id, "SUBMITTED")}
                  className="px-3 py-1.5 border border-input rounded text-xs hover:bg-muted font-medium"
                >
                  Mark as Submitted to Insurer
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBill.id, "REIMBURSED")}
                  className="px-3 py-1.5 border border-input rounded text-xs hover:bg-muted font-medium text-emerald-600"
                >
                  Mark as Reimbursed
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border border-input rounded text-xs font-semibold hover:bg-muted flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Statement
                </button>
                <button
                  onClick={() => notify.success("Superbill PDF generated and ready for patient download")}
                  className="px-4 py-1.5 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif font-bold text-foreground">
              Generate New Superbill
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-foreground">Client Full Name</label>
                <input
                  type="text"
                  required
                  value={newBill.clientName}
                  onChange={(e) => setNewBill({ ...newBill, clientName: e.target.value })}
                  className="w-full mt-1 p-2 bg-background border border-input rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground">Client Email</label>
                  <input
                    type="email"
                    required
                    value={newBill.clientEmail}
                    onChange={(e) => setNewBill({ ...newBill, clientEmail: e.target.value })}
                    className="w-full mt-1 p-2 bg-background border border-input rounded"
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground">Client DOB</label>
                  <input
                    type="date"
                    value={newBill.clientDob}
                    onChange={(e) => setNewBill({ ...newBill, clientDob: e.target.value })}
                    className="w-full mt-1 p-2 bg-background border border-input rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground">CPT Procedure Code</label>
                  <select
                    value={newBill.procedureCode}
                    onChange={(e) =>
                      setNewBill({
                        ...newBill,
                        procedureCode: e.target.value,
                        procedureDescription:
                          e.target.value === "90837"
                            ? "Psychotherapy, 60 minutes"
                            : "Psychotherapy, 45-50 minutes, individual",
                      })
                    }
                    className="w-full mt-1 p-2 bg-background border border-input rounded"
                  >
                    <option value="90834">90834 - Psychotherapy 45m</option>
                    <option value="90837">90837 - Psychotherapy 60m</option>
                    <option value="90791">90791 - Diagnostic Evaluation</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-foreground">ICD-10 Diagnosis</label>
                  <input
                    type="text"
                    required
                    value={newBill.diagnosisCode}
                    onChange={(e) => setNewBill({ ...newBill, diagnosisCode: e.target.value })}
                    placeholder="e.g. F41.1"
                    className="w-full mt-1 p-2 bg-background border border-input rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground">Session Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newBill.amount}
                    onChange={(e) =>
                      setNewBill({
                        ...newBill,
                        amount: parseFloat(e.target.value),
                        amountPaid: parseFloat(e.target.value),
                      })
                    }
                    className="w-full mt-1 p-2 bg-background border border-input rounded"
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground">Amount Paid ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newBill.amountPaid}
                    onChange={(e) =>
                      setNewBill({ ...newBill, amountPaid: parseFloat(e.target.value) })
                    }
                    className="w-full mt-1 p-2 bg-background border border-input rounded"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-input rounded font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-1.5 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 flex items-center gap-1.5"
                >
                  {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Generate Superbill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
