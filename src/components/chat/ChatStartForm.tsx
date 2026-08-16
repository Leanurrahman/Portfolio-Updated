/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { ArrowRight, User, Mail, Briefcase } from "lucide-react";
import { useExperience } from "../../context/ExperienceContext";

const startChatSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address").max(150, "Email must be under 150 characters"),
  projectType: z.string().optional()
});

type StartChatFormValues = z.infer<typeof startChatSchema>;

interface ChatStartFormProps {
  onSubmit: (values: StartChatFormValues) => void;
  loading: boolean;
  defaultName?: string;
  defaultEmail?: string;
}

export const ChatStartForm: React.FC<ChatStartFormProps> = ({ onSubmit, loading, defaultName, defaultEmail }) => {
  const { currentExperience } = useExperience();
  const isCyberpunk = currentExperience === "cyberpunk";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<StartChatFormValues>({
    resolver: zodResolver(startChatSchema),
    defaultValues: {
      name: defaultName || "",
      email: defaultEmail || "",
      projectType: ""
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 p-4 ${isCyberpunk ? "text-white" : "text-text-primary"}`}>
      <div className="space-y-1">
        <label className={`text-[11px] tracking-wider uppercase flex items-center gap-1.5 ${isCyberpunk ? "font-space text-white/70" : "font-mono text-text-secondary"}`}>
          <User size={12} className={isCyberpunk ? "text-[#00E5FF]" : "text-neon-purple"} />
          <span>Your Name *</span>
        </label>
        <div className="relative">
          <input
            {...register("name")}
            type="text"
            placeholder="John Doe"
            disabled={loading}
            className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none transition-all ${
              isCyberpunk 
                ? "bg-black/40 border border-white/10 text-white focus:border-[#00E5FF] placeholder:text-white/30 font-sans" 
                : "bg-bg-primary border border-border-primary text-text-primary focus:border-neon-purple placeholder:text-text-muted/60 font-sans"
            }`}
          />
        </div>
        {errors.name && (
          <p className="text-[10px] font-mono text-red-500 mt-0.5">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className={`text-[11px] tracking-wider uppercase flex items-center gap-1.5 ${isCyberpunk ? "font-space text-white/70" : "font-mono text-text-secondary"}`}>
          <Mail size={12} className={isCyberpunk ? "text-[#00E5FF]" : "text-neon-purple"} />
          <span>Your Email *</span>
        </label>
        <div className="relative">
          <input
            {...register("email")}
            type="email"
            placeholder="john@example.com"
            disabled={loading}
            className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none transition-all ${
              isCyberpunk 
                ? "bg-black/40 border border-white/10 text-white focus:border-[#00E5FF] placeholder:text-white/30 font-sans" 
                : "bg-bg-primary border border-border-primary text-text-primary focus:border-neon-purple placeholder:text-text-muted/60 font-sans"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-[10px] font-mono text-red-500 mt-0.5">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className={`text-[11px] tracking-wider uppercase flex items-center gap-1.5 ${isCyberpunk ? "font-space text-white/70" : "font-mono text-text-secondary"}`}>
          <Briefcase size={12} className={isCyberpunk ? "text-[#00E5FF]" : "text-neon-purple"} />
          <span>Project Type (Optional)</span>
        </label>
        <select
          {...register("projectType")}
          disabled={loading}
          className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none transition-all ${
            isCyberpunk 
              ? "bg-[#0B0B16] border border-white/10 text-white focus:border-[#00E5FF] font-sans" 
              : "bg-bg-primary border border-border-primary text-text-primary focus:border-neon-purple font-sans"
          }`}
        >
          <option value="" className={isCyberpunk ? "bg-[#0B0B16] text-white" : ""}>Select an option</option>
          <option value="web-dev" className={isCyberpunk ? "bg-[#0B0B16] text-white" : ""}>Website Development</option>
          <option value="full-stack" className={isCyberpunk ? "bg-[#0B0B16] text-white" : ""}>Full-Stack Application</option>
          <option value="mobile-app" className={isCyberpunk ? "bg-[#0B0B16] text-white" : ""}>Mobile App</option>
          <option value="consultation" className={isCyberpunk ? "bg-[#0B0B16] text-white" : ""}>Consultation & Strategy</option>
          <option value="other" className={isCyberpunk ? "bg-[#0B0B16] text-white" : ""}>Other / Custom Request</option>
        </select>
      </div>

      <div className="pt-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 ${
            isCyberpunk 
              ? "bg-gradient-to-r from-[#E60094] to-[#7300E6] text-white shadow-[0_0_15px_rgba(230,0,148,0.3)] font-space" 
              : "bg-gradient-to-r from-brand-purple to-neon-purple hover:brightness-110 text-white shadow-md shadow-brand-purple/20 hover:shadow-brand-purple/35 font-sans"
          }`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Start Conversation</span>
              <ArrowRight size={14} />
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};
