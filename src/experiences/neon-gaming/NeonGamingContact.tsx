import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Mail, Briefcase, Send, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MagneticButton from "../../components/MagneticButton";

export default function NeonGamingContact() {
  const { submitContactForm, profile = {} } = usePortfolio();

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
    <section id="contact" className="py-32 bg-transparent relative z-10 overflow-hidden text-left text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-24">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1CD8D2] shadow-[0_0_8px_#1CD8D2]" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#1CD8D2] uppercase font-black">
              [07] TRANSMIT_INQUIRY
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
            START A NEW MISSION.
          </h2>
          <p className="text-white/50 text-xs sm:text-sm leading-relaxed mt-4 max-w-xl font-normal">
            Have a product concept, scaling challenge, or automated pipeline bottleneck? Send over an inquiry and let's configure a secure, fast solution.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-5xl mx-auto">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-4 shadow-sm backdrop-blur-md">
              <h3 className="text-xs font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Sparkles size={13} className="text-[#1CD8D2]" />
                <span>MISSION_COORDINATION</span>
              </h3>
              <p className="text-white/70 text-xs leading-relaxed font-normal">
                I help startup teams, product managers, and creative tech founders deploy clean full stack applications, interactive databases, and automated web systems.
              </p>
            </div>

            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-4 font-mono text-xs text-white/70 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Mail size={13} className="text-[#1CD8D2]" />
                <a href={`mailto:${profile.email || "techbulletcodeyt@gmail.com"}`} className="hover:text-[#1CD8D2] transition-colors font-medium">
                  {profile.email || "techbulletcodeyt@gmail.com"}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase size={13} className="text-[#00BF8F]" />
                <span className="font-medium uppercase text-[10px]">READY_FOR_CONTRACT_ROLES</span>
              </div>
            </div>

            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl text-[10px] text-white/30 italic">
              "True programming skill blends high performance speed with pristine interface discipline."
            </div>
          </div>

          {/* Right Column: Redesigned Control Deck */}
          <div className="lg:col-span-7 relative">
            
            {/* Cyan glowing blur halo */}
            <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-[#1CD8D2]/10 via-purple-500/5 to-transparent blur-xl -z-10" />

            <div className="p-6 md:p-8 bg-black/80 border border-white/15 rounded-[32px] backdrop-blur-xl shadow-2xl relative">
              {/* Corner status markers */}
              <div className="absolute top-4 right-4 text-[8px] font-mono text-white/20">COMMS_ONLINE</div>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    className="text-center py-12 space-y-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="inline-flex p-3.5 bg-[#00BF8F]/10 border border-[#00BF8F]/30 text-[#00BF8F] rounded-2xl animate-bounce shadow-[0_0_15px_rgba(0,191,143,0.15)]">
                      <CheckCircle size={24} />
                    </div>
                    <h3 className="text-base font-mono font-black uppercase tracking-widest text-white">TRANSMISSION_SUCCESSFUL</h3>
                    <p className="text-white/60 text-xs max-w-xs mx-auto leading-relaxed">
                      Thank you. Your project briefing has been successfully registered in the Firestore CMS database. I will contact you back within 24 hours.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-6 px-5 py-2.5 bg-white/[0.04] border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-xs font-mono font-bold rounded-xl focus:outline-none cursor-pointer transition-colors"
                    >
                      SEND_NEW_TRANSMISSION
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-mono">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40">SENDER_NAME *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Commander John"
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 hover:border-[#1CD8D2]/40 rounded-xl text-white text-xs focus:border-[#1CD8D2] focus:ring-1 focus:ring-[#1CD8D2]/20 focus:outline-none transition-all duration-300"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40">SENDER_EMAIL *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@orbit.com"
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 hover:border-[#1CD8D2]/40 rounded-xl text-white text-xs focus:border-[#1CD8D2] focus:ring-1 focus:ring-[#1CD8D2]/20 focus:outline-none transition-all duration-300"
                          required
                        />
                      </div>

                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Company */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40">ORGANIZATION (OPT)</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Guild"
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 hover:border-[#1CD8D2]/40 rounded-xl text-white text-xs focus:border-[#1CD8D2] focus:ring-1 focus:ring-[#1CD8D2]/20 focus:outline-none transition-all duration-300"
                        />
                      </div>

                      {/* Project Type */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40">MISSION_CATEGORY</label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-black border border-white/10 hover:border-[#1CD8D2]/40 rounded-xl text-white text-xs focus:border-[#1CD8D2] focus:outline-none cursor-pointer transition-colors"
                        >
                          {projectTypes.map((type) => (
                            <option key={type} value={type} className="bg-[#08080c] text-white">
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Budget */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40">MISSION_BUDGET_REWARD</label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-white/10 hover:border-[#1CD8D2]/40 rounded-xl text-white text-xs focus:border-[#1CD8D2] focus:outline-none cursor-pointer transition-colors"
                      >
                        {budgetRanges.map((budget) => (
                          <option key={budget} value={budget} className="bg-[#08080c] text-white">
                            {budget}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40">MISSION_BRIEFING *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Outline the core targets, constraints, and timing expectations for this product..."
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 hover:border-[#1CD8D2]/40 rounded-xl text-white text-xs focus:border-[#1CD8D2] focus:ring-1 focus:ring-[#1CD8D2]/20 focus:outline-none resize-none transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <MagneticButton
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-[#1CD8D2] to-[#00BF8F] text-black font-black rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1CD8D2]/15 cursor-pointer"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span>TRANSMIT_INQUIRY</span>
                            <Send size={13} className="fill-black" />
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
