/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Mail, Briefcase, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MagneticButton from "../components/MagneticButton";
import CosmicBackground from "../components/CosmicBackground";
import AnimatedSectionHeading from "../components/AnimatedSectionHeading";

export default function Contact() {
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

  // Form stagger parent container variants
  const formContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  // Individual field variants
  const fieldVariants = {
    hidden: { y: 20, opacity: 0, filter: "blur(2px)" },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  return (
    <section id="contact" className="py-28 bg-bg-primary relative border-t border-border-primary transition-colors duration-350">
      
      {/* Subtle continuous cosmic background */}
      <CosmicBackground intensity={0.25} variant="subtle" />
      
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Contact section titles with Dynamic Headers */}
        <AnimatedSectionHeading 
          number="05" 
          badge="Let's Work Together" 
          title="Start a project" 
          subtitle="Have an idea or a workflow bottleneck? Fill out the details below and let's build something that works beautifully."
        />

        {/* Form and info row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* Left Column: Direct info panels */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 bg-bg-secondary border border-border-primary rounded-xl space-y-4 shadow-sm relative group overflow-hidden"
            >
              {/* Glow border slide */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">Have a project in mind?</h3>
              <p className="text-text-secondary text-xs leading-relaxed font-light">
                I assist remote startup founders, local retail agencies, and web businesses build custom integrations. I respect NDAs and offer rigorous post-launch service.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 bg-bg-secondary border border-border-primary rounded-xl space-y-4 font-mono text-xs text-text-secondary shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Mail size={13} className="text-neon-purple" />
                <a href="mailto:techbulletcodeyt@gmail.com" className="hover:text-neon-purple transition-colors">
                  techbulletcodeyt@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase size={13} className="text-neon-purple" />
                <span>Available for freelance & remote roles</span>
              </div>
            </motion.div>

            {/* Quick aesthetic quote */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-bg-secondary border border-border-primary rounded-xl text-xs text-text-secondary font-serif italic"
            >
              "True product craftsmanship comes from combining high structural speed with meticulous design attention."
            </motion.div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 relative">
            
            {/* Subtle rotating cosmic glow behind contact card */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-purple/10 via-transparent to-neon-purple/5 blur-2xl -z-10 animate-[pulse_3s_infinite_alternate] pointer-events-none" />

            <div className="p-6 md:p-8 bg-bg-secondary border border-border-primary rounded-2xl backdrop-blur-sm shadow-xl relative">
              
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    className="text-center py-12 space-y-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="inline-flex p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl animate-bounce">
                      <CheckCircle size={28} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-text-primary">Inquiry Received!</h3>
                    <p className="text-text-secondary text-sm max-w-sm mx-auto font-light leading-relaxed">
                      Thank you for reaching out. Your project briefing has been securely stored in the CMS, and Leanur will reach out to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-6 px-6 py-3 bg-bg-primary border border-border-primary text-text-secondary rounded-xl hover:text-neon-purple text-xs font-mono uppercase tracking-widest focus:outline-none cursor-pointer transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={formContainerVariants}
                  >
                    {error && (
                      <motion.div 
                        variants={fieldVariants}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm"
                      >
                        <AlertCircle size={15} />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    {/* Staggered Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Name */}
                      <motion.div className="space-y-1.5" variants={fieldVariants}>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-sm focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20 shadow-[0_0_0_1px_transparent] focus:shadow-[0_0_10px_rgba(168,85,247,0.15)] focus:outline-none transition-all duration-300"
                          required
                        />
                      </motion.div>

                      {/* Email */}
                      <motion.div className="space-y-1.5" variants={fieldVariants}>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">Your Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-sm focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20 shadow-[0_0_0_1px_transparent] focus:shadow-[0_0_10px_rgba(168,85,247,0.15)] focus:outline-none transition-all duration-300"
                          required
                        />
                      </motion.div>

                    </div>

                    {/* Staggered Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Company */}
                      <motion.div className="space-y-1.5" variants={fieldVariants}>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">Company Name (Optional)</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                          className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-sm focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20 shadow-[0_0_0_1px_transparent] focus:shadow-[0_0_10px_rgba(168,85,247,0.15)] focus:outline-none transition-all duration-300"
                        />
                      </motion.div>

                      {/* Project Type */}
                      <motion.div className="space-y-1.5" variants={fieldVariants}>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">Project Type</label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-sm focus:border-neon-purple focus:outline-none cursor-pointer transition-colors"
                        >
                          {projectTypes.map((type) => (
                            <option key={type} value={type} className="bg-bg-secondary text-text-primary">
                              {type}
                            </option>
                          ))}
                        </select>
                      </motion.div>

                    </div>

                    {/* Budget Dropdown */}
                    <motion.div className="space-y-1.5" variants={fieldVariants}>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">Approximate Budget</label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-sm focus:border-neon-purple focus:outline-none cursor-pointer transition-colors"
                      >
                        {budgetRanges.map((budget) => (
                          <option key={budget} value={budget} className="bg-bg-secondary text-text-primary">
                            {budget}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Message */}
                    <motion.div className="space-y-1.5" variants={fieldVariants}>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">Brief Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Outline your project scope, timeline, and goals..."
                        className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-xl text-text-primary text-sm focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20 shadow-[0_0_0_1px_transparent] focus:shadow-[0_0_10px_rgba(168,85,247,0.15)] focus:outline-none resize-none font-light transition-all duration-300"
                        required
                      />
                    </motion.div>

                    {/* Submit Button with Magnetic triggers & animated send icons */}
                    <motion.div variants={fieldVariants}>
                      <MagneticButton
                        type="submit"
                        disabled={loading}
                        className="w-full py-4.5 bg-gradient-to-r from-brand-purple to-neon-purple text-white hover:opacity-90 font-bold rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest transition-all shadow-md shadow-neon-purple/15 hover:shadow-neon-purple/25 focus:outline-none cursor-pointer"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="flex items-center gap-1.5 group">
                            <span>Send Proposal</span>
                            <motion.span
                              className="inline-block animate-pulse"
                              whileHover={{ x: 3, y: -3 }}
                            >
                              <Send size={13} className="text-white" />
                            </motion.span>
                          </span>
                        )}
                      </MagneticButton>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
