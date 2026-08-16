/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { Skill, SkillCategory } from "../types";

export default function ManageSkills() {
  const { skills, saveSkill, deleteSkill } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [formData, setFormData] = useState<Omit<Skill, "id">>({
    name: "",
    category: "Frontend",
    proficiency: 80,
    icon: ""
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "proficiency" ? Number(value) : value
    }));
  };

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: "Frontend",
      proficiency: 80,
      icon: ""
    });
    setIsEditing(true);
    setSaved(false);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency || 80,
      icon: skill.icon || ""
    });
    setIsEditing(true);
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setSaving(true);
      const id = editingSkill ? editingSkill.id : "sk_" + Math.random().toString(36).substring(2, 9);
      await saveSkill({
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
    if (confirm("Are you sure you want to delete this skill?")) {
      await deleteSkill(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-text-primary font-sans">Manage Skills</h2>
          <p className="text-text-secondary text-xs mt-1">Configure your professional technologies, frameworks, and tools.</p>
        </div>

        {!isEditing && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus size={14} />
            <span>Add Skill</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Form Box */
        <form onSubmit={handleSubmit} className="p-6 bg-bg-secondary/40 border border-border-primary rounded-3xl max-w-xl backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border-primary pb-3">
            <h3 className="text-xs font-bold text-text-primary font-mono uppercase tracking-wider">
              {editingSkill ? `Edit Skill: ${formData.name}` : "Add New Skill"}
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
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Skill Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none focus:border-brand-orange/40"
                placeholder="React.js / Node.js"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs focus:outline-none"
                >
                  <option value="Frontend">Frontend Dev</option>
                  <option value="Backend">Backend / API</option>
                  <option value="Tools">Workflow Tools</option>
                  <option value="Programming">Computer Science</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Proficiency ({formData.proficiency}%)</label>
                <input
                  type="range"
                  name="proficiency"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={handleInputChange}
                  className="w-full mt-2 h-1 bg-bg-primary border border-border-primary rounded-lg appearance-none cursor-pointer accent-brand-orange"
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
                  <span>Save Skill</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Grid Display list */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(["Frontend", "Backend", "Tools", "Programming"] as SkillCategory[]).map((cat) => {
            const skillList = skills.filter((s) => s.category === cat);
            return (
              <div key={cat} className="p-5 bg-bg-secondary/40 border border-border-primary rounded-2xl backdrop-blur-sm space-y-4">
                <div className="pb-3 border-b border-border-primary flex items-center justify-between">
                  <h3 className="text-xs font-bold text-brand-orange font-mono uppercase tracking-widest">{cat}</h3>
                  <span className="text-[10px] font-mono text-text-muted">{skillList.length}</span>
                </div>

                <div className="space-y-3">
                  {skillList.map((skill) => (
                    <div key={skill.id} className="p-3 bg-bg-primary rounded-xl border border-border-primary/80 flex items-center justify-between group">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-text-primary block">{skill.name}</span>
                        {skill.proficiency && (
                          <div className="w-24 h-1 bg-bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-brand-orange" style={{ width: `${skill.proficiency}%` }} />
                          </div>
                        )}
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className="p-1 bg-bg-primary hover:bg-bg-secondary border border-border-primary text-text-secondary hover:text-brand-orange rounded transition-colors cursor-pointer"
                        >
                          <Edit2 size={10} />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1 bg-red-500/10 border border-red-500/20 text-red-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {skillList.length === 0 && (
                    <p className="text-text-muted text-[11px] font-mono py-4">No elements registered.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
