/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Shield, Key, Mail, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import MagneticButton from "../components/MagneticButton";

interface AdminLoginProps {
  onBack?: () => void;
}

export default function AdminLogin({ onBack }: AdminLoginProps) {
  const { loginWithEmail, errorMsg } = usePortfolio();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setLocalError(null);
      const success = await loginWithEmail(email, password);
      if (!success) {
        // If login failed but errorMsg is not set by context, set fallback
        setLocalError(null);
      }
    } catch (err) {
      setLocalError("Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <motion.div
        className="relative w-full max-w-md bg-bg-secondary/40 border border-border-primary rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        {/* Logo and title */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl text-brand-orange">
            <Shield size={28} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-text-primary font-sans tracking-tight">Admin CMS Portal</h2>
            <p className="text-text-secondary text-xs">Login to manage portfolio projects, profile, content, and messages.</p>
          </div>
        </div>

        {/* Display System or Local Errors */}
        {(errorMsg || localError) && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500 text-xs leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{localError || errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Mail size={14} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@leanur.dev"
                className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-primary focus:border-brand-orange/40 focus:outline-none rounded-xl text-text-primary text-sm transition-colors"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Key size={14} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-bg-primary border border-border-primary focus:border-brand-orange/40 focus:outline-none rounded-xl text-text-primary text-sm transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <MagneticButton
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-brand-glow"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Secure Sign In</span>
                <LogIn size={14} />
              </>
            )}
          </MagneticButton>
        </form>

        {/* Back to website option */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onBack?.();
            }}
            className="text-[11px] font-mono text-text-muted hover:text-text-secondary cursor-pointer transition-colors focus:outline-none"
          >
            ← Return to Public Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
}
