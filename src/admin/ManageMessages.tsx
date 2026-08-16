/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Trash2, Check, CheckSquare, MessageSquare, Briefcase, DollarSign, Filter, Mail, HelpCircle, Eye, RefreshCw } from "lucide-react";
import { ContactMessage } from "../types";

export default function ManageMessages() {
  const { messages, updateMessageStatus, deleteMessage } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<ContactMessage["status"] | "All">("All");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Filter messages
  const filteredMessages =
    activeFilter === "All"
      ? messages
      : messages.filter((m) => m.status === activeFilter);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this client message?")) {
      await deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: ContactMessage["status"], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await updateMessageStatus(id, newStatus);
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      // Mark as read immediately when clicked
      await handleStatusChange(msg.id, "read");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary font-sans">Client Messages</h2>
        <p className="text-text-secondary text-xs mt-1">Review, organize, and reply to client inquiries and project proposals.</p>
      </div>

      {/* Grid of filters and items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Filter & Inquiries List */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Status filters row */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-bg-primary border border-border-primary rounded-xl max-w-max">
            {["All", "unread", "read", "replied"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeFilter === filter
                    ? "bg-brand-orange text-white font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Messages container list */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative group ${
                  selectedMessage?.id === msg.id
                    ? "bg-brand-orange/10 border-brand-orange/30"
                    : "bg-bg-secondary/40 border-border-primary hover:bg-bg-secondary/60"
                }`}
              >
                {/* Dynamic Status Badges */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-text-primary font-bold">{msg.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono uppercase ${
                      msg.status === "unread"
                        ? "bg-red-500 text-white animate-pulse"
                        : msg.status === "read"
                        ? "bg-bg-primary text-text-secondary border border-border-primary"
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                </div>

                <p className="text-text-secondary text-xs line-clamp-1">{msg.message}</p>

                <div className="flex justify-between items-center text-[9px] font-mono text-text-muted pt-1">
                  <span>{msg.projectType}</span>
                  <span>{msg.budgetRange}</span>
                </div>

                {/* Quick actions on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => handleDelete(msg.id, e)}
                    className="p-1 bg-red-500/10 border border-red-500/20 text-red-500 hover:text-red-400 rounded"
                    title="Delete Message"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}

            {filteredMessages.length === 0 && (
              <div className="text-center py-12 border border-dashed border-border-primary rounded-2xl text-text-muted font-mono text-xs">
                No messages found under this filter.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Selected Message Case Details */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 bg-bg-secondary/40 border border-border-primary rounded-2xl space-y-6 backdrop-blur-sm animate-fade-in">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-border-primary pb-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-text-primary">{selectedMessage.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Mail size={12} className="text-brand-orange" />
                    <a href={`mailto:${selectedMessage.email}`} className="hover:underline text-brand-orange font-mono">{selectedMessage.email}</a>
                  </div>
                  {selectedMessage.company && (
                    <p className="text-[10px] text-text-secondary font-mono">Company: <span className="text-text-primary">{selectedMessage.company}</span></p>
                  )}
                </div>

                {/* Status Toggle Actions */}
                <div className="flex flex-col gap-2 items-end">
                  <span className="text-[9px] font-mono text-text-muted">
                    Received: {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : "Just Now"}
                  </span>
                  
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, "read")}
                      className={`px-2 py-1 text-[10px] font-mono border rounded-lg cursor-pointer ${
                        selectedMessage.status === "read"
                          ? "bg-bg-primary border-border-primary text-text-primary"
                          : "bg-bg-primary border-border-primary text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Read
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, "replied")}
                      className={`px-2 py-1 text-[10px] font-mono border rounded-lg cursor-pointer flex items-center gap-1 ${
                        selectedMessage.status === "replied"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                          : "bg-bg-primary border-border-primary text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <Check size={11} />
                      <span>Replied</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Scope & Budget Specifications */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-bg-primary/50 border border-border-primary rounded-xl font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-text-muted block text-[10px] uppercase tracking-wider">Project Focus</span>
                  <span className="text-text-primary font-bold flex items-center gap-2">
                    <Briefcase size={12} className="text-brand-orange" />
                    {selectedMessage.projectType}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-text-muted block text-[10px] uppercase tracking-wider">Proposed Budget</span>
                  <span className="text-text-primary font-bold flex items-center gap-2">
                    <DollarSign size={12} className="text-emerald-500" />
                    {selectedMessage.budgetRange}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">Message Details</span>
                <div className="p-4 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Prompts */}
              <div className="pt-4 border-t border-border-primary flex justify-between items-center">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Inquiry - ${selectedMessage.projectType}`}
                  className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <RefreshCw size={12} className="animate-spin-slow" />
                  <span>Reply via Direct Email</span>
                </a>

                <button
                  onClick={(e) => handleDelete(selectedMessage.id, e)}
                  className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 hover:text-red-400 rounded-xl text-xs font-mono cursor-pointer transition-colors"
                >
                  Delete Message
                </button>
              </div>

            </div>
          ) : (
            <div className="h-[300px] border border-dashed border-border-primary rounded-2xl flex flex-col items-center justify-center text-text-muted font-mono text-xs space-y-2">
              <MessageSquare size={24} className="text-text-muted/50" />
              <span>Select a message from the list to read specifications.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
