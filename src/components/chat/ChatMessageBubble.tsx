/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ChatMessage } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { useExperience } from "../../context/ExperienceContext";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isVisitor = message.sender === "visitor";
  const isSystem = message.sender === "system" || message.sender === "admin_auto";
  const { theme } = useTheme();
  const { currentExperience } = useExperience();
  const isCyberpunk = currentExperience === "cyberpunk";

  // Simple format timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex flex-col ${isVisitor ? "items-end" : "items-start"} mb-3`}>
      <div className="flex items-center gap-1.5 mb-1 px-1">
        {isSystem && (
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
            isCyberpunk 
              ? "text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/30 font-space" 
              : "text-text-secondary bg-bg-secondary border-border-primary/60 font-sans"
          }`}>
            Auto Reply
          </span>
        )}
        {!isVisitor && !isSystem && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
            isCyberpunk 
              ? "text-[#E60094] bg-[#E60094]/10 border-[#E60094]/30 font-space" 
              : "text-neon-purple bg-brand-purple/10 border-brand-purple/20 font-sans"
          }`}>
            Admin
          </span>
        )}
        <span className={`text-[10px] text-text-muted ${isCyberpunk ? "font-space" : "font-mono"}`}>
          {formatTime(message.createdAt)}
        </span>
      </div>

      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
          isCyberpunk
            ? isVisitor
              ? "bg-gradient-to-r from-[#E60094]/90 to-[#7300E6]/90 border border-[#E60094]/45 text-white rounded-tr-none shadow-[0_0_12px_rgba(230,0,148,0.25)] font-sans"
              : "bg-[#0B0B16]/80 text-white border border-[#00E5FF]/45 rounded-tl-none shadow-[0_0_12px_rgba(0,229,255,0.15)] font-sans"
            : isVisitor
              ? "bg-gradient-to-r from-brand-purple to-neon-purple text-white rounded-tr-none shadow-sm font-sans"
              : "bg-bg-secondary text-text-primary border border-border-primary/60 rounded-tl-none shadow-sm font-sans"
        }`}
        style={{ wordBreak: "break-word" }}
      >
        {message.text}
      </div>
    </div>
  );
};
