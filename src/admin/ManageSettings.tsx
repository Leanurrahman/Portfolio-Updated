/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Save, ShieldAlert, Sparkles, Settings } from "lucide-react";
import { SiteSettings } from "../types";

export default function ManageSettings() {
  const { siteSettings, saveSiteSettings } = usePortfolio();
  
  const [formData, setFormData] = useState<SiteSettings>({
    ...siteSettings
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveSiteSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-text-primary font-sans">Site Configurations</h2>
        <p className="text-text-secondary text-xs mt-1">Configure site-wide text lines, branding options, and metadata.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-bg-secondary/40 border border-border-primary rounded-3xl p-6 backdrop-blur-sm">
        
        {/* Logo and Brand */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold flex items-center gap-1.5">
            <Settings size={13} />
            <span>Navigation & Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Navbar Logo Text</label>
              <input
                type="text"
                name="logoText"
                value={formData.logoText}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                placeholder="Leanur.dev"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Target Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                placeholder="techbulletcodeyt@gmail.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="space-y-4 pt-6 border-t border-border-primary">
          <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">Copyright Lines</h3>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Footer Text</label>
            <input
              type="text"
              name="footerText"
              value={formData.footerText}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
              placeholder="© 2026 Leanur Rahman. All rights reserved."
              required
            />
          </div>
        </div>

        {/* Chat Welcome Message */}
        <div className="space-y-4 pt-6 border-t border-border-primary">
          <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Chat Settings</span>
          </h3>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Auto Welcome Message</label>
            <textarea
              name="welcomeMessage"
              value={formData.welcomeMessage || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none resize-none leading-relaxed"
              placeholder="Hi! I’m Leanur. Tell me about your project and I’ll reply soon."
              required
            />
            <span className="text-[10px] font-mono text-text-muted block leading-normal">
              This message is automatically sent to visitors when they start a new chat session on the public website.
            </span>
          </div>
        </div>

        {/* Maintenance Toggle */}
        <div className="space-y-4 pt-6 border-t border-border-primary">
          <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">System Status</h3>
          
          <div className="flex items-start gap-3 p-4 bg-bg-primary border border-border-primary rounded-xl">
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={handleCheckboxChange}
              className="w-4 h-4 mt-0.5 text-brand-orange bg-bg-primary border-border-primary rounded focus:ring-brand-orange"
            />
            <div className="space-y-1 cursor-pointer">
              <label htmlFor="maintenanceMode" className="text-xs font-medium text-text-primary block">
                Enable Maintenance Mode
              </label>
              <span className="text-[10px] font-mono text-text-muted block leading-normal">
                If active, the public website displays a clean "Under Construction" card to regular visitors, blocking routing. Admins can still log in and preview layouts.
              </span>
            </div>
          </div>
        </div>

        {/* Submit action */}
        <div className="pt-6 border-t border-border-primary flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs font-mono text-emerald-500 animate-fade-in flex items-center gap-1">
              ✓ Settings saved successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className={`px-5 py-3 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
              saved 
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10" 
                : "bg-brand-orange hover:bg-brand-orange-hover shadow-brand-glow"
            }`}
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <>
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Site Settings</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
