/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Plus, Edit2, Trash2, X, Save, Image, Star } from "lucide-react";
import { Testimonial } from "../types";

export default function ManageTestimonials() {
  const { testimonials, saveTestimonial, deleteTestimonial, uploadImage } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [editingTest, setEditingTest] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState<Omit<Testimonial, "id">>({
    clientName: "",
    clientRole: "",
    clientCompany: "",
    clientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    message: "",
    rating: 5
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file, "testimonials");
      setFormData((prev) => ({
        ...prev,
        clientImage: url
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTest(null);
    setFormData({
      clientName: "",
      clientRole: "",
      clientCompany: "",
      clientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      message: "",
      rating: 5
    });
    setIsEditing(true);
    setSaved(false);
  };

  const handleOpenEdit = (test: Testimonial) => {
    setEditingTest(test);
    setFormData({
      clientName: test.clientName,
      clientRole: test.clientRole,
      clientCompany: test.clientCompany,
      clientImage: test.clientImage,
      message: test.message,
      rating: test.rating || 5
    });
    setIsEditing(true);
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.message) return;

    try {
      setSaving(true);
      const id = editingTest ? editingTest.id : "tst_" + Math.random().toString(36).substring(2, 9);
      await saveTestimonial({
        ...formData,
        id
      });
      setSaved(true);
      setTimeout(() => {
        setIsEditing(false);
        setSaved(false);
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      await deleteTestimonial(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-sans">Client Endorsements</h2>
          <p className="text-text-secondary text-xs mt-1">Manage public client testimonials, roles, and review star ratings.</p>
        </div>

        {!isEditing && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus size={14} />
            <span>Add Testimonial</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Testimonial Form */
        <form onSubmit={handleSubmit} className="p-6 bg-bg-secondary/40 border border-border-primary rounded-3xl max-w-2xl backdrop-blur-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border-primary pb-3">
            <h3 className="text-xs font-bold text-text-primary font-mono uppercase tracking-wider">
              {editingTest ? `Edit Review: ${formData.clientName}` : "Add New Testimonial"}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg animate-fade-in"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Client Avatar upload */}
            <div className="md:col-span-4 flex flex-col items-center space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Reviewer Photo</span>
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border-primary bg-bg-primary">
                <img src={formData.clientImage} alt="Avatar Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {uploading && (
                  <div className="absolute inset-0 bg-bg-primary/70 flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <label className="px-3 py-1.5 bg-bg-primary hover:bg-bg-secondary border border-border-primary rounded-lg text-[10px] font-mono text-text-primary cursor-pointer transition-colors">
                <span>{uploading ? "Uploading..." : "Upload Avatar"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>

            {/* Other Inputs */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none focus:border-brand-orange/40"
                    placeholder="Sarah Jenkins"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Rating Score</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Client Role</label>
                  <input
                    type="text"
                    name="clientRole"
                    value={formData.clientRole}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                    placeholder="CEO & Founder"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Company Name</label>
                  <input
                    type="text"
                    name="clientCompany"
                    value={formData.clientCompany}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                    placeholder="Innovate Tech Ltd"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Client Quote Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3.5 py-2 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs resize-none focus:outline-none"
                  placeholder="Leanur delivered our custom order tracking panel 3 days ahead of schedule. The responsiveness and speed are impeccable..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-primary flex justify-end gap-2 items-center">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-bg-primary border border-border-primary text-text-secondary hover:text-text-primary rounded-xl text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                saved 
                  ? "bg-emerald-500 text-white" 
                  : "bg-brand-orange text-white hover:bg-brand-orange-hover"
              }`}
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : saved ? (
                <>
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Save Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Reviews Grid list */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-6 bg-bg-secondary/40 border border-border-primary rounded-2xl backdrop-blur-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < test.rating ? "text-amber-400 fill-amber-400" : "text-text-muted/40"}
                      />
                    ))}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEdit(test)}
                      className="p-1.5 bg-bg-primary hover:bg-bg-secondary border border-border-primary rounded text-text-secondary hover:text-brand-orange transition-colors cursor-pointer"
                    >
                      <Edit2 size={11} />
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="p-1.5 bg-red-500/10 border border-red-500/20 rounded text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                <p className="text-text-secondary text-xs italic">"{test.message}"</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-primary flex items-center gap-3">
                <img src={test.clientImage} alt={test.clientName} className="w-10 h-10 rounded-full object-cover bg-bg-primary border border-border-primary" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{test.clientName}</h4>
                  <p className="text-[10px] font-mono text-text-secondary">{test.clientRole}, <span className="text-brand-orange">{test.clientCompany}</span></p>
                </div>
              </div>
            </div>
          ))}

          {testimonials.length === 0 && (
            <div className="col-span-full text-center py-12 border border-dashed border-border-primary rounded-2xl text-text-muted font-mono text-xs">
              No reviews registered yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
