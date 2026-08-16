/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Plus, Edit2, Trash2, X, Save, Eye, EyeOff } from "lucide-react";
import { Service } from "../types";

export default function ManageServices() {
  const { services, saveService, deleteService } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<Omit<Service, "id">>({
    title: "",
    description: "",
    icon: "Layers",
    active: true,
    ctaText: "Inquire Now"
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val
    }));
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      icon: "Layers",
      active: true,
      ctaText: "Inquire Now"
    });
    setIsEditing(true);
    setSaved(false);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || "Layers",
      active: !!service.active,
      ctaText: service.ctaText || "Inquire Now"
    });
    setIsEditing(true);
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    try {
      setSaving(true);
      const id = editingService ? editingService.id : "srv_" + Math.random().toString(36).substring(2, 9);
      await saveService({
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
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-sans">Manage Services</h2>
          <p className="text-text-secondary text-xs mt-1">Refine and publish operational services, icon alignments, and CTA prompts.</p>
        </div>

        {!isEditing && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors animate-fade-in"
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit/Create Form */
        <form onSubmit={handleSubmit} className="p-6 bg-bg-secondary/40 border border-border-primary rounded-3xl max-w-2xl backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border-primary pb-3">
            <h3 className="text-xs font-bold text-text-primary font-mono uppercase tracking-wider">
              {editingService ? `Edit Service: ${formData.title}` : "Add New Service"}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Service Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none focus:border-brand-orange/40"
                placeholder="Full Stack Web App Development"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Icon Name (Lucide format)</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                >
                  <option value="Layers">Layers</option>
                  <option value="Layout">Layout</option>
                  <option value="Code">Code</option>
                  <option value="Gauge">Gauge</option>
                  <option value="ShoppingBag">ShoppingBag</option>
                  <option value="Server">Server</option>
                  <option value="Cpu">Cpu</option>
                  <option value="Globe">Globe</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">CTA Button Text</label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                  placeholder="Inquire Now"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Detailed Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs resize-none focus:outline-none"
                placeholder="Describe details, stack support, and value propositions..."
                required
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-bg-primary border border-border-primary rounded-xl">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded focus:ring-brand-orange"
              />
              <label htmlFor="active" className="text-xs font-medium text-text-primary cursor-pointer">
                Show service publicly on the website
              </label>
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
                  <span>Save Service</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* List Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`p-6 bg-bg-secondary/40 border rounded-2xl backdrop-blur-sm flex flex-col justify-between group transition-colors ${
                service.active ? "border-border-primary" : "border-border-primary opacity-60"
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 bg-bg-primary border border-border-primary rounded font-mono text-[9px] text-brand-orange uppercase tracking-widest">
                    Icon: {service.icon}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono ${
                      service.active
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15"
                        : "bg-bg-primary text-text-muted border border-border-primary"
                    }`}>
                      {service.active ? <Eye size={10} /> : <EyeOff size={10} />}
                      <span>{service.active ? "ACTIVE" : "HIDDEN"}</span>
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-text-primary">{service.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{service.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-primary flex justify-between items-center">
                <span className="text-[10px] font-mono text-text-muted">CTA: "{service.ctaText || "Inquire Now"}"</span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 bg-bg-primary hover:bg-bg-secondary border border-border-primary rounded text-text-secondary hover:text-brand-orange transition-colors cursor-pointer"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 bg-red-500/10 border border-red-500/20 rounded text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <div className="col-span-full text-center py-12 border border-dashed border-border-primary rounded-2xl text-text-muted font-mono text-xs">
              No services registered.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
