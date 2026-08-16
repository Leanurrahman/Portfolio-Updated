/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Save, User, Image, Link, Briefcase, GraduationCap } from "lucide-react";
import { Profile } from "../types";

export default function ManageProfile() {
  const { profile, saveProfile, uploadImage } = usePortfolio();
  
  const [formData, setFormData] = useState<Profile>({
    ...profile,
    socialLinks: profile.socialLinks || { github: "", linkedin: "", facebook: "", email: "" },
    education: profile.education || { degree: "", institution: "", year: "" }
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value
      }
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file, "profile");
      setFormData((prev) => ({
        ...prev,
        profileImage: url
      }));
    } catch (err) {
      console.error("Failed uploading image: ", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-text-primary font-sans">Manage Profile</h2>
        <p className="text-text-secondary text-xs mt-1">Configure your personal bio, active title, portrait image, and education details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-bg-secondary/40 border border-border-primary rounded-3xl p-6 backdrop-blur-sm">
        
        {/* Row: Profile Avatar Uploader & Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Portrait Image Uploader Column */}
          <div className="md:col-span-4 flex flex-col items-center space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Avatar Image</span>
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-border-primary bg-bg-primary">
              <img
                src={formData.profileImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {uploading && (
                <div className="absolute inset-0 bg-bg-primary/70 flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            <label className="px-3.5 py-1.5 bg-bg-primary hover:bg-bg-secondary border border-border-primary rounded-lg text-xs font-mono text-text-primary cursor-pointer transition-colors">
              <span>{uploading ? "Uploading..." : "Replace Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-[10px] text-text-muted text-center max-w-[150px]">Accepts standard image file formats. Reverts to secure Base64 url encoding if storage rules are locked.</p>
          </div>

          {/* Core Info Inputs Column */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Active Role Title</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Geographic Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Availability Status</label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
              >
                <option value="available">Available for Freelance & Remote Work</option>
                <option value="busy">Booked Out</option>
                <option value="looking-for-offers">Looking for Offers / Internships</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">CV Link / URL</label>
              <input
                type="text"
                name="cvUrl"
                value={formData.cvUrl}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                placeholder="#"
              />
            </div>

          </div>
        </div>

        {/* Section: Typography Details (Title, tagline, bio) */}
        <div className="space-y-4 pt-6 border-t border-border-primary">
          <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange">Website Typography</h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Hero Main Title (Headline)</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Hero Subtitle (Tagline)</label>
              <textarea
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none resize-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Professional Bio (About Section)</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none resize-y"
                required
              />
            </div>
          </div>
        </div>

        {/* Section: Education credentials */}
        <div className="space-y-4 pt-6 border-t border-border-primary">
          <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange flex items-center gap-2">
            <GraduationCap size={14} />
            <span>Academic Qualifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.education.degree}
                onChange={handleEducationChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                placeholder="B.Sc. in Computer Science"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Institution</label>
              <input
                type="text"
                name="institution"
                value={formData.education.institution}
                onChange={handleEducationChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                placeholder="IIUC Chittagong"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Sprinting Year</label>
              <input
                type="text"
                name="year"
                value={formData.education.year}
                onChange={handleEducationChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                placeholder="2023 - Present"
              />
            </div>
          </div>
        </div>

        {/* Section: Social Links */}
        <div className="space-y-4 pt-6 border-t border-border-primary">
          <h3 className="text-xs font-mono uppercase tracking-widest text-brand-orange">Social Connections</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">GitHub Profile URL</label>
              <input
                type="text"
                name="github"
                value={formData.socialLinks.github}
                onChange={handleSocialChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">LinkedIn Profile URL</label>
              <input
                type="text"
                name="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleSocialChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Facebook Profile URL</label>
              <input
                type="text"
                name="facebook"
                value={formData.socialLinks.facebook}
                onChange={handleSocialChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Contact Email Address</label>
              <input
                type="text"
                name="email"
                value={formData.socialLinks.email}
                onChange={handleSocialChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions Button */}
        <div className="pt-6 border-t border-border-primary flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs font-mono text-emerald-500 animate-fade-in flex items-center gap-1">
              ✓ Profile updated successfully!
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
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
