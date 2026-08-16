import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Mail, Briefcase, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MagneticButton from "../../components/MagneticButton";

export default function AppleContact() {
  const { submitContactForm } = usePortfolio();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "Full Stack Application",
    budgetRange: "$1K - $3K",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectTypes = [
    "Full Stack Application",
    "Business Landing Page",
    "Admin Dashboard / CMS",
    "E-commerce Website",
    "REST API Development",
    "Other Consultancy"
  ];

  const budgetRanges = [
    "Under $1K",
    "$1K - $3K",
    "$3K - $5K",
    "$5K+"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields (Name, Email, and Message).");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await submitContactForm(formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        projectType: "Full Stack Application",
        budgetRange: "$1K - $3K",
        message: ""
      });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-transparent relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-24 text-left">
          <span className="text-[10px] font-mono tracking-[0.3em] text-blue-500 uppercase font-black block mb-2.5">
            06 / CONSULTATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Let’s start a project.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-xl font-normal">
            Have a product concept, scaling challenge, or automation bottleneck? Send over a brief description and let's craft a secure, beautiful solution.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-5xl mx-auto">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-6 bg-white/60 border border-slate-900/10 rounded-3xl space-y-4 shadow-sm backdrop-blur-md">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Have a project in mind?</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                I help startup founders, local retail agencies, and digital product teams build custom full stack solutions, dashboards, and automated APIs.
              </p>
            </div>

            <div className="p-6 bg-white/60 border border-slate-900/10 rounded-3xl space-y-4 font-sans text-xs text-slate-600 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Mail size={13} className="text-blue-500" />
                <a href="mailto:techbulletcodeyt@gmail.com" className="hover:text-blue-600 transition-colors font-medium">
                  techbulletcodeyt@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase size={13} className="text-blue-500" />
                <span className="font-medium">Available for contract & remote roles</span>
              </div>
            </div>

            <div className="p-6 bg-white/40 border border-slate-900/5 rounded-3xl text-xs text-slate-400 italic">
              "True interface craftsmanship merges speed and layout discipline into a single visual melody."
            </div>
          </div>

          {/* Right Column: Frosted Form Container */}
          <div className="lg:col-span-7 relative">
            
            {/* Ambient cyan glow behind panel */}
            <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-blue-500/5 via-cyan-500/5 to-transparent blur-xl -z-10" />

            <div className="p-6 md:p-8 bg-white/60 border border-slate-900/10 rounded-[32px] backdrop-blur-xl shadow-xl text-left">
              
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    className="text-center py-12 space-y-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="inline-flex p-3.5 bg-blue-50 border border-blue-100 text-blue-500 rounded-2xl animate-bounce">
                      <CheckCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900">Inquiry Received</h3>
                    <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                      Thank you. Your proposal details have been safely registered and sent directly to my database. I will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-6 px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl focus:outline-none cursor-pointer transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-3 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-white/90 border border-slate-900/5 rounded-xl text-slate-800 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 shadow-sm"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 bg-white/90 border border-slate-900/5 rounded-xl text-slate-800 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 shadow-sm"
                          required
                        />
                      </div>

                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Company */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company (Optional)</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                          className="w-full px-4 py-3 bg-white/90 border border-slate-900/5 rounded-xl text-slate-800 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 shadow-sm"
                        />
                      </div>

                      {/* Project Type */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Project Type</label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/90 border border-slate-900/5 rounded-xl text-slate-800 text-xs focus:border-blue-500 focus:outline-none cursor-pointer transition-colors shadow-sm"
                        >
                          {projectTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Budget */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approximate Budget</label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/90 border border-slate-900/5 rounded-xl text-slate-800 text-xs focus:border-blue-500 focus:outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        {budgetRanges.map((budget) => (
                          <option key={budget} value={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Brief Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Outline your project goals, scope, and timeline expectations..."
                        className="w-full px-4 py-3 bg-white/90 border border-slate-900/5 rounded-xl text-slate-800 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none resize-none transition-all duration-300 shadow-sm"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <MagneticButton
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:brightness-105 font-bold rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span>Send Proposal</span>
                            <Send size={13} />
                          </span>
                        )}
                      </MagneticButton>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
