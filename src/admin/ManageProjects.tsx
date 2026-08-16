/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Plus, Edit2, Trash2, X, Save, Image, Star, Eye } from "lucide-react";
import { Project } from "../types";

export default function ManageProjects() {
  const { projects, saveProject, deleteProject, uploadImage } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    title: "",
    shortDescription: "",
    longDescription: "",
    techStack: [],
    category: "Full Stack",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    liveLink: "",
    githubLink: "",
    featured: false,
    client: "",
    year: "",
    problemSolved: "",
    keyFeatures: [],
    results: "",
    order: 1
  });

  const [techInput, setTechInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      shortDescription: "",
      longDescription: "",
      techStack: [],
      category: "Full Stack",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      liveLink: "",
      githubLink: "",
      featured: false,
      client: "",
      year: "",
      problemSolved: "",
      keyFeatures: [],
      results: "",
      order: projects.length + 1
    });
    setTechInput("");
    setFeaturesInput("");
    setIsEditing(true);
    setSaved(false);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      techStack: project.techStack || [],
      category: project.category || "Full Stack",
      thumbnail: project.thumbnail,
      liveLink: project.liveLink || "",
      githubLink: project.githubLink || "",
      featured: !!project.featured,
      client: project.client || "",
      year: project.year || "",
      problemSolved: project.problemSolved || "",
      keyFeatures: project.keyFeatures || [],
      results: project.results || "",
      order: project.order || 1
    });
    setTechInput((project.techStack || []).join(", "));
    setFeaturesInput((project.keyFeatures || []).join("\n"));
    setIsEditing(true);
    setSaved(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: val
    }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file, "projects");
      setFormData((prev) => ({
        ...prev,
        thumbnail: url
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Parse CSV inputs
      const techStack = techInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      
      const keyFeatures = featuresInput
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const id = editingProject ? editingProject.id : "proj_" + Math.random().toString(36).substring(2, 9);
      
      const targetProject: Project = {
        ...formData,
        id,
        techStack,
        keyFeatures,
        order: Number(formData.order)
      };

      await saveProject(targetProject);
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
    if (confirm("Are you sure you want to delete this project? This operation is irreversible.")) {
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-sans">Project Workspace</h2>
          <p className="text-text-secondary text-xs mt-1">Manage project case studies, categories, and priority order.</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <Plus size={14} />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit/Create Form Block */
        <form onSubmit={handleSubmit} className="p-6 bg-bg-secondary/40 border border-border-primary rounded-3xl backdrop-blur-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border-primary pb-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">
              {editingProject ? `Edit Project: ${formData.title}` : "Create New Project"}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Col: Upload & Basic Info */}
            <div className="md:col-span-4 space-y-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block">Thumbnail</span>
              
              <div className="relative aspect-video rounded-xl overflow-hidden bg-bg-primary border border-border-primary">
                <img src={formData.thumbnail} alt="Project Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {uploading && (
                  <div className="absolute inset-0 bg-bg-primary/70 flex items-center justify-center">
                    <span className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <label className="w-full py-2.5 bg-bg-primary hover:bg-bg-secondary border border-border-primary rounded-xl text-xs font-mono text-text-primary cursor-pointer transition-colors flex items-center justify-center gap-2">
                <Image size={14} />
                <span>{uploading ? "Uploading..." : "Upload Thumbnail"}</span>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" disabled={uploading} />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-xs focus:outline-none"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend/UI">Frontend / UI</option>
                    <option value="Backend/API">Backend / API</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Order Index</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-text-primary text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-bg-primary/50 border border-border-primary rounded-xl">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-brand-orange bg-bg-primary border-border-primary rounded focus:ring-brand-orange"
                />
                <label htmlFor="featured" className="text-xs font-medium text-text-primary flex items-center gap-1.5 cursor-pointer">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span>Mark as Featured Project</span>
                </label>
              </div>
            </div>

            {/* Right Col: Details */}
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                  placeholder="BiteSpeed - Multi-Vendor Delivery App"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Live URL</label>
                  <input
                    type="text"
                    name="liveLink"
                    value={formData.liveLink}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">GitHub URL</label>
                  <input
                    type="text"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                  placeholder="Fast summary of problem, stack and output..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs font-mono focus:border-brand-orange/40 focus:outline-none"
                  placeholder="React, Next.js, Express, MongoDB"
                />
              </div>
            </div>
          </div>

          {/* Section: Case Study specifics */}
          <div className="space-y-4 pt-6 border-t border-border-primary">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">Case Study Detailed Contents</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Client / Org</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                  placeholder="Acme Inc."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Development Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:border-brand-orange/40 focus:outline-none"
                  placeholder="2026"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Case Study Long Description</label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs resize-y focus:border-brand-orange/40 focus:outline-none"
                placeholder="Write a thorough overview describing project architecture, scope, and technical methodologies..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">The Problem Solved (The Challenge)</label>
                <textarea
                  name="problemSolved"
                  value={formData.problemSolved}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs resize-y focus:border-brand-orange/40 focus:outline-none"
                  placeholder="What organizational challenge was this application built to solve?"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Key Features (One feature per line)</label>
                <textarea
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs resize-y focus:border-brand-orange/40 focus:outline-none"
                  placeholder="Live order status tracking&#10;Stripe payment gateway integration"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Results / Impact Summary</label>
              <textarea
                name="results"
                value={formData.results}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3.5 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs resize-y focus:border-brand-orange/40 focus:outline-none"
                placeholder="E.g., Enabled $120k in transaction value within 90 days, cutting order latency by 40%."
              />
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="pt-6 border-t border-border-primary flex justify-end gap-3 items-center">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-bg-primary hover:bg-bg-secondary border border-border-primary text-text-secondary hover:text-text-primary rounded-xl text-xs font-mono cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-5 py-2 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all ${
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
                  <span>{editingProject ? "Update Project" : "Publish Project"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Projects List Table */
        <div className="bg-bg-secondary/40 border border-border-primary rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-4 bg-bg-secondary border-b border-border-primary flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-text-muted font-bold">Project List</span>
            <span className="text-[10px] font-mono text-text-muted">{projects.length} Entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-primary bg-bg-secondary text-[10px] font-mono uppercase tracking-wider text-text-secondary">
                  <th className="p-4 font-normal">Thumbnail</th>
                  <th className="p-4 font-normal">Title</th>
                  <th className="p-4 font-normal">Category</th>
                  <th className="p-4 font-normal text-center">Featured</th>
                  <th className="p-4 font-normal text-center">Order</th>
                  <th className="p-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-bg-secondary/50 text-xs text-text-primary transition-colors">
                    <td className="p-4">
                      <img src={proj.thumbnail} alt={proj.title} className="w-14 h-9 rounded object-cover bg-bg-primary border border-border-primary" referrerPolicy="no-referrer" />
                    </td>
                    <td className="p-4 font-bold text-text-primary">
                      <span>{proj.title}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-bg-secondary text-brand-orange border border-border-primary rounded font-mono text-[10px]">
                        {proj.category}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {proj.featured ? (
                        <span className="inline-flex px-1.5 py-0.5 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded font-mono text-[9px]">YES</span>
                      ) : (
                        <span className="text-text-muted font-mono text-[9px]">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center font-mono">
                      <span>{proj.order}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(proj)}
                          className="p-1.5 bg-bg-primary border border-border-primary rounded text-text-secondary hover:text-brand-orange transition-colors cursor-pointer"
                          title="Edit Case Study"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-1.5 bg-red-500/10 border border-red-500/20 rounded text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-muted font-mono text-xs">
                      No projects registered. Click "Add New Project" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
