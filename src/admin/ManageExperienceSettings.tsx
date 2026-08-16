/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Save, RefreshCw, Upload, X, Check, Sparkles, Eye, Shield, Laptop, Apple, Gamepad2, Compass } from "lucide-react";
import { ExperienceSettings, SiteSettings } from "../types";
import { defaultExperienceSettings, defaultSiteSettings } from "../data/defaultData";

export default function ManageExperienceSettings() {
  const { 
    experienceSettings, 
    saveExperienceSettings, 
    siteSettings, 
    saveSiteSettings,
    uploadImage,
    successMsg,
    errorMsg
  } = usePortfolio();

  // State for whole experience settings
  const [formData, setFormData] = useState<ExperienceSettings>(() => ({
    ...defaultExperienceSettings,
    ...experienceSettings
  }));

  // State for SiteSettings options
  const [siteData, setSiteData] = useState<SiteSettings>(() => ({
    ...defaultSiteSettings,
    ...siteSettings
  }));

  // Sync state if context loads/updates
  useEffect(() => {
    if (experienceSettings) {
      setFormData((prev) => ({
        ...defaultExperienceSettings,
        ...prev,
        ...experienceSettings
      }));
    }
  }, [experienceSettings]);

  useEffect(() => {
    if (siteSettings) {
      setSiteData((prev) => ({
        ...defaultSiteSettings,
        ...prev,
        ...siteSettings
      }));
    }
  }, [siteSettings]);

  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Handle nested toggle switches
  const handleToggle = (expKey: keyof ExperienceSettings, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [expKey]: {
        ...prev[expKey],
        [field]: !((prev[expKey] as any)[field])
      }
    }));
  };

  // Handle input values
  const handleInputChange = (
    expKey: keyof ExperienceSettings,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [expKey]: {
        ...prev[expKey],
        [field]: value
      }
    }));
  };

  // Upload validation and action
  const validateAndUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    expKey: keyof ExperienceSettings,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    try {
      const fieldId = `${expKey}_${field}`;
      setUploadingField(fieldId);
      const url = await uploadImage(file, "experiences");
      handleInputChange(expKey, field, url);
    } catch (err) {
      console.error("Failed uploading image:", err);
    } finally {
      setUploadingField(null);
    }
  };

  // Clear image overrides
  const handleRemoveOverride = (expKey: keyof ExperienceSettings, field: string) => {
    handleInputChange(expKey, field, "");
  };

  // Handle saving configurations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Save Advanced Experience settings in experienceSettings/main
      await saveExperienceSettings(formData);
      
      // Save global site theme & switching rules in siteSettings/main
      await saveSiteSettings(siteData);
    } catch (err) {
      console.error("Failed saving experience settings:", err);
    } finally {
      setSaving(false);
    }
  };

  // Reset all settings to defaults
  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all themes and experience configurations to original defaults? This will erase current customizations.")) {
      setFormData({ ...defaultExperienceSettings });
      setSiteData({ ...defaultSiteSettings });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-primary pb-5">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-sans flex items-center gap-2">
            <Sparkles className="text-brand-orange" size={22} />
            <span>Theme & Experience Architect</span>
          </h2>
          <p className="text-text-secondary text-xs mt-1">
            Separate simple visual presets from high-fidelity custom experiences. Complete control over status, visibility, and aesthetics.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 border border-border-primary hover:bg-bg-secondary rounded-xl text-text-secondary hover:text-text-primary font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* GLOBAL SWITCHER SETTINGS */}
        <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 space-y-6 shadow-sm">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Compass className="text-brand-orange" size={16} />
            <span>Global Switcher & Theme Control</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">
                Default Theme Preset (Simple Theme)
              </label>
              <select
                value={siteData.defaultThemePreset || "cosmic-orange"}
                onChange={(e) => setSiteData({ ...siteData, defaultThemePreset: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
              >
                <option value="cosmic-orange">🌌 Cosmic Orange (Default)</option>
                <option value="neon-purple">🟣 Neon Purple</option>
                <option value="clean-light">☀️ Clean Light</option>
              </select>
              <p className="text-[9px] text-text-muted">Applied when visitor chooses standard layouts.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">
                Default Experience Mode
              </label>
              <select
                value={siteData.defaultExperience || "cosmic"}
                onChange={(e) => setSiteData({ ...siteData, defaultExperience: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
              >
                <option value="cosmic">Cosmic Developer (Default Modern)</option>
                <option value="gta6">GTA VI (Vice City Sunset)</option>
                <option value="apple">Apple Glass (AR Reality)</option>
                <option value="neon-gaming">Neon Gaming (Retrowave Mode)</option>
                <option value="terminal">Hacker Terminal (CRT Phosphor)</option>
              </select>
              <p className="text-[9px] text-text-muted">The initial view loaded for first-time visitors.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">
                Fallback Theme
              </label>
              <select
                value={siteData.fallbackTheme || "cosmic-orange"}
                onChange={(e) => setSiteData({ ...siteData, fallbackTheme: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
              >
                <option value="cosmic-orange">Cosmic Orange</option>
                <option value="neon-purple">Neon Purple</option>
                <option value="clean-light">Clean Light</option>
              </select>
              <p className="text-[9px] text-text-muted">Fallback preset if an experience gets disabled.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-3 border-t border-border-primary/50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={siteData.allowPublicExperienceSwitching ?? true}
                onChange={(e) => setSiteData({ ...siteData, allowPublicExperienceSwitching: e.target.checked })}
                className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-text-primary">Allow Public Theme/Experience Switching</span>
                <span className="text-[9px] text-text-muted">Enables/disables the switcher dropdown in the navbar.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={siteData.showSpecialExperiences ?? true}
                onChange={(e) => setSiteData({ ...siteData, showSpecialExperiences: e.target.checked })}
                className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-text-primary">Show Special Experiences Section</span>
                <span className="text-[9px] text-text-muted">Allows displaying public-visible special experiences in dropdown.</span>
              </div>
            </label>
          </div>
        </div>

        {/* 1. GTA VI EXPERIENCE */}
        <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-primary/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pink-500/10 text-pink-500 rounded-2xl">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">1. GTA VI (Vice City Sunset)</h3>
                <p className="text-[10px] text-text-muted">Vibrant pink, purple and orange retro cinematic portfolio style.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleToggle("gta6", "enabled")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold border transition-all ${
                  formData.gta6.enabled
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {formData.gta6.enabled ? "● Enabled" : "○ Disabled"}
              </button>
              
              <button
                type="button"
                onClick={() => handleToggle("gta6", "publicVisible")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold border transition-all ${
                  formData.gta6.publicVisible
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}
              >
                {formData.gta6.publicVisible ? "👁 Publicly Visible" : "🔒 Admin Only / Hidden"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Display Name</label>
                  <input
                    type="text"
                    value={formData.gta6.displayName || "GTA VI"}
                    onChange={(e) => handleInputChange("gta6", "displayName", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Sunset Gradient Intensity</label>
                  <select
                    value={formData.gta6.gradientIntensity || "high"}
                    onChange={(e) => handleInputChange("gta6", "gradientIntensity", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                  >
                    <option value="low">Subtle Dawn (Low)</option>
                    <option value="medium">Magic Hour (Medium)</option>
                    <option value="high">Neon Vice Sunset (High)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Switcher Description</label>
                <textarea
                  value={formData.gta6.description || ""}
                  onChange={(e) => handleInputChange("gta6", "description", e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none resize-none"
                />
              </div>

              {/* Overrides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Profile Frame Override</label>
                  <div className="flex items-center gap-3">
                    {formData.gta6.profileImageOverride ? (
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border-primary shrink-0">
                        <img src={formData.gta6.profileImageOverride} alt="GTA VI profile" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveOverride("gta6", "profileImageOverride")} className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-bg-primary border-2 border-dashed border-border-primary flex items-center justify-center text-text-muted shrink-0 text-[10px]">None</div>
                    )}
                    <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border-primary rounded-xl cursor-pointer hover:border-brand-orange/40 p-2 transition-all">
                      {uploadingField === "gta6_profileImageOverride" ? <span className="w-3 h-3 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /> : <span className="text-[9px] text-text-secondary font-mono">Upload</span>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => validateAndUpload(e, "gta6", "profileImageOverride")} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Sunset Banner Override</label>
                  <div className="flex items-center gap-3">
                    {formData.gta6.heroImageOverride ? (
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border-primary shrink-0">
                        <img src={formData.gta6.heroImageOverride} alt="GTA VI hero" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveOverride("gta6", "heroImageOverride")} className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-bg-primary border-2 border-dashed border-border-primary flex items-center justify-center text-text-muted shrink-0 text-[10px]">None</div>
                    )}
                    <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border-primary rounded-xl cursor-pointer hover:border-brand-orange/40 p-2 transition-all">
                      {uploadingField === "gta6_heroImageOverride" ? <span className="w-3 h-3 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /> : <span className="text-[9px] text-text-secondary font-mono">Upload</span>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => validateAndUpload(e, "gta6", "heroImageOverride")} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary pb-1.5">Colors & Fine-Tuning</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-text-secondary">Primary Pink</label>
                  <input
                    type="color"
                    value={formData.gta6.primaryPink || "#ff007f"}
                    onChange={(e) => handleInputChange("gta6", "primaryPink", e.target.value)}
                    className="w-full h-9 border border-border-primary rounded-xl bg-transparent overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.gta6.primaryPink || "#ff007f"}
                    onChange={(e) => handleInputChange("gta6", "primaryPink", e.target.value)}
                    className="w-full text-[8px] font-mono text-center p-1 bg-bg-primary border border-border-primary rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-text-secondary">Sec Orange</label>
                  <input
                    type="color"
                    value={formData.gta6.secondaryOrange || "#ff5e00"}
                    onChange={(e) => handleInputChange("gta6", "secondaryOrange", e.target.value)}
                    className="w-full h-9 border border-border-primary rounded-xl bg-transparent overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.gta6.secondaryOrange || "#ff5e00"}
                    onChange={(e) => handleInputChange("gta6", "secondaryOrange", e.target.value)}
                    className="w-full text-[8px] font-mono text-center p-1 bg-bg-primary border border-border-primary rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-text-secondary">Bg Purple</label>
                  <input
                    type="color"
                    value={formData.gta6.backgroundPurple || "#0d0118"}
                    onChange={(e) => handleInputChange("gta6", "backgroundPurple", e.target.value)}
                    className="w-full h-9 border border-border-primary rounded-xl bg-transparent overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.gta6.backgroundPurple || "#0d0118"}
                    onChange={(e) => handleInputChange("gta6", "backgroundPurple", e.target.value)}
                    className="w-full text-[8px] font-mono text-center p-1 bg-bg-primary border border-border-primary rounded-md"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border-primary/50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.gta6.cinematicEffectsEnabled ?? true}
                    onChange={() => handleToggle("gta6", "cinematicEffectsEnabled")}
                    className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-primary font-mono uppercase">Cinematic Sunset Effects</span>
                    <span className="text-[9px] text-text-muted">Renders real-time neon haze and abstract palm tree silhouettes.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 2. APPLE GLASS EXPERIENCE */}
        <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-primary/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-2xl">
                <Apple size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">2. Apple Glass (Sleek AR)</h3>
                <p className="text-[10px] text-text-muted">Clean bento layout with dynamic glassmorphism and subtle reflection glares.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleToggle("appleGlass", "enabled")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold border transition-all ${
                  formData.appleGlass.enabled
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {formData.appleGlass.enabled ? "● Enabled" : "○ Disabled"}
              </button>
              
              <button
                type="button"
                onClick={() => handleToggle("appleGlass", "publicVisible")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold border transition-all ${
                  formData.appleGlass.publicVisible
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}
              >
                {formData.appleGlass.publicVisible ? "👁 Publicly Visible" : "🔒 Admin Only / Hidden"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Display Name</label>
                  <input
                    type="text"
                    value={formData.appleGlass.displayName || "Apple Glass"}
                    onChange={(e) => handleInputChange("appleGlass", "displayName", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Glass Blur Strength ({formData.appleGlass.blurStrength || 20}px)</label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={formData.appleGlass.blurStrength || 20}
                    onChange={(e) => handleInputChange("appleGlass", "blurStrength", parseInt(e.target.value))}
                    className="w-full accent-brand-orange h-1 bg-bg-primary rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Switcher Description</label>
                <textarea
                  value={formData.appleGlass.description || ""}
                  onChange={(e) => handleInputChange("appleGlass", "description", e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none resize-none"
                />
              </div>

              {/* Overrides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">AR Profile Override</label>
                  <div className="flex items-center gap-3">
                    {formData.appleGlass.profileImageOverride ? (
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border-primary shrink-0">
                        <img src={formData.appleGlass.profileImageOverride} alt="Apple glass profile" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveOverride("appleGlass", "profileImageOverride")} className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-bg-primary border-2 border-dashed border-border-primary flex items-center justify-center text-text-muted shrink-0 text-[10px]">None</div>
                    )}
                    <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border-primary rounded-xl cursor-pointer hover:border-brand-orange/40 p-2 transition-all">
                      {uploadingField === "appleGlass_profileImageOverride" ? <span className="w-3 h-3 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /> : <span className="text-[9px] text-text-secondary font-mono">Upload</span>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => validateAndUpload(e, "appleGlass", "profileImageOverride")} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Vision Hero Override</label>
                  <div className="flex items-center gap-3">
                    {formData.appleGlass.heroImageOverride ? (
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border-primary shrink-0">
                        <img src={formData.appleGlass.heroImageOverride} alt="Apple glass hero" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveOverride("appleGlass", "heroImageOverride")} className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-bg-primary border-2 border-dashed border-border-primary flex items-center justify-center text-text-muted shrink-0 text-[10px]">None</div>
                    )}
                    <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border-primary rounded-xl cursor-pointer hover:border-brand-orange/40 p-2 transition-all">
                      {uploadingField === "appleGlass_heroImageOverride" ? <span className="w-3 h-3 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /> : <span className="text-[9px] text-text-secondary font-mono">Upload</span>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => validateAndUpload(e, "appleGlass", "heroImageOverride")} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary pb-1.5">Glass Accent & Strength</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase text-text-secondary">Glass Accent Blue</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.appleGlass.accentBlue || "#007AFF"}
                      onChange={(e) => handleInputChange("appleGlass", "accentBlue", e.target.value)}
                      className="w-10 h-10 border border-border-primary rounded-xl bg-transparent overflow-hidden cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={formData.appleGlass.accentBlue || "#007AFF"}
                      onChange={(e) => handleInputChange("appleGlass", "accentBlue", e.target.value)}
                      className="w-full text-xs p-2 bg-bg-primary border border-border-primary rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Glass Transparency ({formData.appleGlass.glassIntensity || 68}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={formData.appleGlass.glassIntensity || 68}
                    onChange={(e) => handleInputChange("appleGlass", "glassIntensity", parseInt(e.target.value))}
                    className="w-full accent-brand-orange h-1.5 bg-bg-primary rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border-primary/50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.appleGlass.reflectionEffectsEnabled ?? true}
                    onChange={() => handleToggle("appleGlass", "reflectionEffectsEnabled")}
                    className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-primary font-mono uppercase">Reflective Glare Overlays</span>
                    <span className="text-[9px] text-text-muted">Displays sleek interactive gloss overlays shifting with cursor hover.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 3. NEON GAMING EXPERIENCE */}
        <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-primary/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 text-cyan-500 rounded-2xl">
                <Gamepad2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">3. Neon Gaming (Retrowave Arcade)</h3>
                <p className="text-[10px] text-text-muted">Cyberpunk grid backdrop with heavy neon outer glows and custom gaming cursors.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleToggle("neonGaming", "enabled")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold border transition-all ${
                  formData.neonGaming.enabled
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {formData.neonGaming.enabled ? "● Enabled" : "○ Disabled"}
              </button>
              
              <button
                type="button"
                onClick={() => handleToggle("neonGaming", "publicVisible")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold border transition-all ${
                  formData.neonGaming.publicVisible
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}
              >
                {formData.neonGaming.publicVisible ? "👁 Publicly Visible" : "🔒 Admin Only / Hidden"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Display Name</label>
                  <input
                    type="text"
                    value={formData.neonGaming.displayName || "Neon Gaming"}
                    onChange={(e) => handleInputChange("neonGaming", "displayName", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Mascot Graphics</label>
                  <div className="flex items-center gap-3">
                    {formData.neonGaming.heroImageOverride ? (
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border-primary shrink-0">
                        <img src={formData.neonGaming.heroImageOverride} alt="Neon hero mascot" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveOverride("neonGaming", "heroImageOverride")} className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-bg-primary border-2 border-dashed border-border-primary flex items-center justify-center text-text-muted shrink-0 text-[10px]">None</div>
                    )}
                    <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border-primary rounded-xl cursor-pointer hover:border-brand-orange/40 p-2 transition-all">
                      {uploadingField === "neonGaming_heroImageOverride" ? <span className="w-3 h-3 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /> : <span className="text-[9px] text-text-secondary font-mono">Upload</span>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => validateAndUpload(e, "neonGaming", "heroImageOverride")} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Switcher Description</label>
                <textarea
                  value={formData.neonGaming.description || ""}
                  onChange={(e) => handleInputChange("neonGaming", "description", e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Profile Image Override</label>
                <div className="flex items-center gap-3">
                  {formData.neonGaming.profileImageOverride ? (
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border-primary shrink-0">
                      <img src={formData.neonGaming.profileImageOverride} alt="Neon profile" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveOverride("neonGaming", "profileImageOverride")} className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"><X size={12} /></button>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-bg-primary border-2 border-dashed border-border-primary flex items-center justify-center text-text-muted shrink-0 text-[10px]">None</div>
                  )}
                  <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border-primary rounded-xl cursor-pointer hover:border-brand-orange/40 p-2 transition-all">
                    {uploadingField === "neonGaming_profileImageOverride" ? <span className="w-3 h-3 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /> : <span className="text-[9px] text-text-secondary font-mono">Upload</span>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => validateAndUpload(e, "neonGaming", "profileImageOverride")} />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary pb-1.5">Neon Colors & Settings</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-text-secondary">Cyan Glow</label>
                  <input
                    type="color"
                    value={formData.neonGaming.cyanAccent || "#1cd8d2"}
                    onChange={(e) => handleInputChange("neonGaming", "cyanAccent", e.target.value)}
                    className="w-full h-9 border border-border-primary rounded-xl bg-transparent overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.neonGaming.cyanAccent || "#1cd8d2"}
                    onChange={(e) => handleInputChange("neonGaming", "cyanAccent", e.target.value)}
                    className="w-full text-[8px] font-mono text-center p-1 bg-bg-primary border border-border-primary rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-text-secondary">Green Accent</label>
                  <input
                    type="color"
                    value={formData.neonGaming.greenAccent || "#00BF8F"}
                    onChange={(e) => handleInputChange("neonGaming", "greenAccent", e.target.value)}
                    className="w-full h-9 border border-border-primary rounded-xl bg-transparent overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.neonGaming.greenAccent || "#00BF8F"}
                    onChange={(e) => handleInputChange("neonGaming", "greenAccent", e.target.value)}
                    className="w-full text-[8px] font-mono text-center p-1 bg-bg-primary border border-border-primary rounded-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-text-secondary">Purple Accent</label>
                  <input
                    type="color"
                    value={formData.neonGaming.purpleAccent || "#9B51E0"}
                    onChange={(e) => handleInputChange("neonGaming", "purpleAccent", e.target.value)}
                    className="w-full h-9 border border-border-primary rounded-xl bg-transparent overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.neonGaming.purpleAccent || "#9B51E0"}
                    onChange={(e) => handleInputChange("neonGaming", "purpleAccent", e.target.value)}
                    className="w-full text-[8px] font-mono text-center p-1 bg-bg-primary border border-border-primary rounded-md"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t border-border-primary/50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.neonGaming.particlesEnabled ?? true}
                    onChange={() => handleToggle("neonGaming", "particlesEnabled")}
                    className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded"
                  />
                  <span className="text-[10px] font-bold text-text-primary font-mono uppercase">Interactive Retro Grid Dust</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.neonGaming.introAnimationEnabled ?? true}
                    onChange={() => handleToggle("neonGaming", "introAnimationEnabled")}
                    className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded"
                  />
                  <span className="text-[10px] font-bold text-text-primary font-mono uppercase">8-Bit Retro Game Intro Sequence</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 4. HACKER TERMINAL EXPERIENCE */}
        <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-primary/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-500/10 text-green-500 rounded-2xl">
                <Laptop size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">4. Hacker Terminal (Monochrome CRT)</h3>
                <p className="text-[10px] text-text-muted">A retro terminal aesthetic with scanlines, matrix drops, and command prompts.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleToggle("hackerTerminal", "enabled")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold border transition-all ${
                  formData.hackerTerminal.enabled
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {formData.hackerTerminal.enabled ? "● Enabled" : "○ Disabled"}
              </button>
              
              <button
                type="button"
                onClick={() => handleToggle("hackerTerminal", "publicVisible")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold border transition-all ${
                  formData.hackerTerminal.publicVisible
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}
              >
                {formData.hackerTerminal.publicVisible ? "👁 Publicly Visible" : "🔒 Admin Only / Hidden"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Display Name</label>
                  <input
                    type="text"
                    value={formData.hackerTerminal.displayName || "Hacker Terminal"}
                    onChange={(e) => handleInputChange("hackerTerminal", "displayName", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Profile Frame Override</label>
                  <div className="flex items-center gap-3">
                    {formData.hackerTerminal.profileImageOverride ? (
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border-primary shrink-0">
                        <img src={formData.hackerTerminal.profileImageOverride} alt="Hacker profile" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveOverride("hackerTerminal", "profileImageOverride")} className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-bg-primary border-2 border-dashed border-border-primary flex items-center justify-center text-text-muted shrink-0 text-[10px]">None</div>
                    )}
                    <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border-primary rounded-xl cursor-pointer hover:border-brand-orange/40 p-2 transition-all">
                      {uploadingField === "hackerTerminal_profileImageOverride" ? <span className="w-3 h-3 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /> : <span className="text-[9px] text-text-secondary font-mono">Upload</span>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => validateAndUpload(e, "hackerTerminal", "profileImageOverride")} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary block">Switcher Description</label>
                <textarea
                  value={formData.hackerTerminal.description || ""}
                  onChange={(e) => handleInputChange("hackerTerminal", "description", e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-text-secondary border-b border-border-primary pb-1.5">Terminal Colors & Features</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-text-secondary">Phosphor Green Color</label>
                  <input
                    type="color"
                    value={formData.hackerTerminal.terminalGreen || "#00FF66"}
                    onChange={(e) => handleInputChange("hackerTerminal", "terminalGreen", e.target.value)}
                    className="w-full h-9 border border-border-primary rounded-xl bg-transparent overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.hackerTerminal.terminalGreen || "#00FF66"}
                    onChange={(e) => handleInputChange("hackerTerminal", "terminalGreen", e.target.value)}
                    className="w-full text-xs p-1 bg-bg-primary border border-border-primary rounded-md text-center mt-1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-text-secondary">Terminal Background</label>
                  <input
                    type="color"
                    value={formData.hackerTerminal.terminalBackground || "#050B05"}
                    onChange={(e) => handleInputChange("hackerTerminal", "terminalBackground", e.target.value)}
                    className="w-full h-9 border border-border-primary rounded-xl bg-transparent overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.hackerTerminal.terminalBackground || "#050B05"}
                    onChange={(e) => handleInputChange("hackerTerminal", "terminalBackground", e.target.value)}
                    className="w-full text-xs p-1 bg-bg-primary border border-border-primary rounded-md text-center mt-1"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t border-border-primary/50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hackerTerminal.scanlineEnabled ?? true}
                    onChange={() => handleToggle("hackerTerminal", "scanlineEnabled")}
                    className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded"
                  />
                  <span className="text-[10px] font-bold text-text-primary font-mono uppercase">CRT Monitor Scanline Overlay</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hackerTerminal.typingAnimationEnabled ?? true}
                    onChange={() => handleToggle("hackerTerminal", "typingAnimationEnabled")}
                    className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded"
                  />
                  <span className="text-[10px] font-bold text-text-primary font-mono uppercase">Simulated Key Typing FX</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hackerTerminal.matrixEffectEnabled ?? true}
                    onChange={() => handleToggle("hackerTerminal", "matrixEffectEnabled")}
                    className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded"
                  />
                  <span className="text-[10px] font-bold text-text-primary font-mono uppercase">Background Green Rain drops</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK POPUPS */}
        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center gap-3 animate-fade-in text-xs font-mono">
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 animate-fade-in text-xs font-mono">
            <X size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SAVE ACTION FLOATER */}
        <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 flex items-center justify-end shadow-lg">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-7 py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl text-xs uppercase tracking-widest font-black shadow-lg shadow-brand-orange/15 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={14} />
                <span>Save Architect Configuration</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
