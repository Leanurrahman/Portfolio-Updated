/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  X,
  Minimize2,
  Send,
  Loader2,
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  MoreVertical
} from "lucide-react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  increment,
  writeBatch,
  setDoc
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { ChatStartForm } from "./ChatStartForm";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatConversation, ChatMessage } from "../../types";
import { sendEmailNotification } from "../../firebase/emailNotification";
import { usePortfolio } from "../../context/PortfolioContext";
import { useExperience } from "../../context/ExperienceContext";

export const ChatWidget: React.FC = () => {
  const { siteSettings } = usePortfolio();
  const { currentExperience } = useExperience();
  const isCyberpunk = currentExperience === "cyberpunk";
  const welcomeMsg = siteSettings?.welcomeMessage || "Hi! I’m Leanur. Tell me about your project and I’ll reply soon.";

  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(() => {
    return localStorage.getItem("portfolio-chat-id");
  });
  
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "new" | "end" | "clear" | null }>({ isOpen: false, type: null });
  
  // Real-time site presence for admin
  const [adminPresence, setAdminPresence] = useState<{ online: boolean; lastSeen?: any; updatedAt?: any } | null>(null);

  // Reset menu and modal when widget is closed
  useEffect(() => {
    if (!isOpen) {
      setIsMenuOpen(false);
      setConfirmModal({ isOpen: false, type: null });
    }
  }, [isOpen]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 150);
    }
  }, [messages, isOpen, conversation?.adminTyping]);

  // Subscribe to admin presence
  useEffect(() => {
    const presenceRef = doc(db, "sitePresence", "admin");
    const unsubscribePresence = onSnapshot(
      presenceRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setAdminPresence(snapshot.data() as any);
        } else {
          setAdminPresence(null);
        }
      },
      (err) => {
        console.error("Error reading presence:", err);
      }
    );
    return () => unsubscribePresence();
  }, []);

  // Determine if admin is actually online
  // We check the "online" flag and verify it was updated within the last 3 minutes
  const isAdminOnline = (() => {
    if (!adminPresence) return false;
    if (!adminPresence.online) return false;
    if (!adminPresence.updatedAt) return true; // fallback if no timestamp yet

    let updatedDate: Date;
    if (adminPresence.updatedAt.toDate) {
      updatedDate = adminPresence.updatedAt.toDate();
    } else {
      updatedDate = new Date(adminPresence.updatedAt);
    }

    const diffMinutes = (Date.now() - updatedDate.getTime()) / 60000;
    return diffMinutes < 3; // online if heartbeat is fresher than 3 minutes
  })();

  // Format last seen timestamp
  const formatLastSeen = () => {
    if (isAdminOnline) return "Online now";
    if (!adminPresence || !adminPresence.lastSeen) return "Offline";

    let date: Date;
    if (adminPresence.lastSeen.toDate) {
      date = adminPresence.lastSeen.toDate();
    } else if (adminPresence.lastSeen instanceof Date) {
      date = adminPresence.lastSeen;
    } else {
      date = new Date(adminPresence.lastSeen);
    }

    const elapsedMs = Date.now() - date.getTime();
    const elapsedMin = Math.floor(elapsedMs / 60000);
    if (elapsedMin < 1) return "Last seen recently";
    if (elapsedMin < 60) return `Last seen ${elapsedMin}m ago`;
    const elapsedHours = Math.floor(elapsedMin / 60);
    if (elapsedHours < 24) return `Last seen ${elapsedHours}h ago`;
    return `Last seen on ${date.toLocaleDateString()}`;
  };

  // Load conversation and messages if chatId exists
  useEffect(() => {
    if (!chatId) {
      setConversation(null);
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Listen to conversation metadata
    const convDocRef = doc(db, "chatConversations", chatId);
    const unsubscribeConv = onSnapshot(
      convDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const conv = { id: snapshot.id, ...data } as ChatConversation;
          
          if (conv.status === "closed") {
            localStorage.removeItem("portfolio-chat-id");
            setChatId(null);
            setConversation(null);
            setMessages([]);
            setLoading(false);
            return;
          }

          setConversation(conv);
          
          // If there are unread messages for visitor, clear them when widget is open
          if (isOpen && conv.unreadByVisitor > 0) {
            updateDoc(convDocRef, { unreadByVisitor: 0 }).catch(console.error);
          }
          
          // Set unread indicator dot for visitor
          setHasUnread(conv.unreadByVisitor > 0);
        } else {
          // If conversation deleted from admin, reset localStorage
          localStorage.removeItem("portfolio-chat-id");
          setChatId(null);
          setConversation(null);
          setMessages([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching conversation:", err);
        setError("Could not load chat. Starting a new conversation.");
        localStorage.removeItem("portfolio-chat-id");
        setChatId(null);
        setLoading(false);
      }
    );

    // 2. Listen to messages inside subcollection in real-time
    const messagesRef = collection(db, "chatConversations", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    
    const unsubscribeMessages = onSnapshot(
      q,
      (snapshot) => {
        const msgsList: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          msgsList.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
        });
        setMessages(msgsList);

        // Mark admin messages as read in batch if widget is open
        if (isOpen) {
          const unreadAdminMsgs = snapshot.docs.filter(
            d => (d.data().sender === "admin" || d.data().sender === "admin_auto" || d.data().sender === "system") && !d.data().read
          );
          if (unreadAdminMsgs.length > 0) {
            const batch = writeBatch(db);
            unreadAdminMsgs.forEach(d => {
              batch.update(doc(db, "chatConversations", chatId, "messages", d.id), { read: true });
            });
            batch.commit().catch(console.error);
          }
        }
      },
      (err) => {
        console.error("Error fetching messages:", err);
      }
    );

    return () => {
      unsubscribeConv();
      unsubscribeMessages();
    };
  }, [chatId, isOpen]);

  // Handle typing updates from the visitor
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (!chatId) return;

    // Instantly set visitor typing to true
    updateDoc(doc(db, "chatConversations", chatId), { visitorTyping: true }).catch(console.error);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Reset after 2.5 seconds of silence
    typingTimeoutRef.current = setTimeout(() => {
      updateDoc(doc(db, "chatConversations", chatId), { visitorTyping: false }).catch(console.error);
    }, 2500);
  };

  // Ensure typing status is cleared on blur or unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (chatId) {
        updateDoc(doc(db, "chatConversations", chatId), { visitorTyping: false }).catch(() => {});
      }
    };
  }, [chatId]);

  // Handle clear unread when opening widget
  const handleOpenWidget = () => {
    setIsOpen(true);
    if (chatId) {
      const convDocRef = doc(db, "chatConversations", chatId);
      updateDoc(convDocRef, { unreadByVisitor: 0 }).catch(console.error);
    }
  };

  // Start chat conversation form submission
  const handleStartChat = async (values: { name: string; email: string; projectType?: string }) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Create conversation document
      const conversationsRef = collection(db, "chatConversations");
      const tempId = doc(conversationsRef).id; // pre-generate ID for strict validation

      const newConv: Omit<ChatConversation, "createdAt" | "updatedAt"> & { createdAt: any; updatedAt: any } = {
        id: tempId,
        visitorName: values.name,
        visitorEmail: values.email,
        projectType: values.projectType || "",
        status: isAdminOnline ? "open" : "offline_pending",
        adminOnline: isAdminOnline,
        unreadByAdmin: 0,
        unreadByVisitor: 0,
        lastMessage: welcomeMsg,
        lastMessageSender: "admin_auto",
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        visitorTyping: false,
        adminTyping: false
      };

      await setDoc(doc(db, "chatConversations", tempId), newConv);

      // 2. Add an initial auto welcome message to subcollection idempotently
      const messagesRef = collection(db, "chatConversations", tempId, "messages");
      await setDoc(doc(messagesRef, "welcome_message"), {
        sender: "admin_auto",
        text: welcomeMsg,
        createdAt: serverTimestamp(),
        read: true,
        type: "welcome"
      });

      // 3. Save to state and localStorage
      localStorage.setItem("portfolio-chat-id", tempId);
      localStorage.setItem("portfolio-visitor-name", values.name);
      localStorage.setItem("portfolio-visitor-email", values.email);
      setChatId(tempId);

      // Send email notification to admin about the new started chat
      sendEmailNotification({
        visitorName: values.name,
        visitorEmail: values.email,
        projectType: values.projectType || "General Inquiry",
        message: "New conversation initiated",
        conversationId: tempId,
        timestamp: new Date().toLocaleString(),
        sender: "system",
        messageId: "init_" + tempId
      });

    } catch (err: any) {
      console.error("Error starting chat:", err);
      setError("Failed to initialize conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Start a new chat, leaving the old one intact for admin
  const handleNewChatConfirm = async () => {
    const name = localStorage.getItem("portfolio-visitor-name") || conversation?.visitorName || "";
    const email = localStorage.getItem("portfolio-visitor-email") || conversation?.visitorEmail || "";
    const projectType = conversation?.projectType || "";

    if (!name || !email) {
      // If we don't have visitor info, simply reset state to show start form
      localStorage.removeItem("portfolio-chat-id");
      setChatId(null);
      setConversation(null);
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Remove old chatId from localStorage
      localStorage.removeItem("portfolio-chat-id");

      // Create new conversation document
      const conversationsRef = collection(db, "chatConversations");
      const tempId = doc(conversationsRef).id;

      const newConv: Omit<ChatConversation, "createdAt" | "updatedAt"> & { createdAt: any; updatedAt: any } = {
        id: tempId,
        visitorName: name,
        visitorEmail: email,
        projectType: projectType,
        status: isAdminOnline ? "open" : "offline_pending",
        adminOnline: isAdminOnline,
        unreadByAdmin: 0,
        unreadByVisitor: 0,
        lastMessage: welcomeMsg,
        lastMessageSender: "admin_auto",
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        visitorTyping: false,
        adminTyping: false
      };

      await setDoc(doc(db, "chatConversations", tempId), newConv);

      // Add welcome message idempotently
      const messagesRef = collection(db, "chatConversations", tempId, "messages");
      await setDoc(doc(messagesRef, "welcome_message"), {
        sender: "admin_auto",
        text: welcomeMsg,
        createdAt: serverTimestamp(),
        read: true,
        type: "welcome"
      });

      // Save to state and localStorage
      localStorage.setItem("portfolio-chat-id", tempId);
      setChatId(tempId);

      // Send email notification to admin about the new started chat
      sendEmailNotification({
        visitorName: name,
        visitorEmail: email,
        projectType: projectType || "General Inquiry",
        message: "New conversation initiated via visitor New Chat menu",
        conversationId: tempId,
        timestamp: new Date().toLocaleString(),
        sender: "system",
        messageId: "new_chat_init_" + tempId
      });

    } catch (err: any) {
      console.error("Error starting new chat:", err);
      setError("Failed to start new chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // End current chat by setting status to "closed" and resetting visitor view
  const handleEndChatConfirm = async () => {
    if (!chatId) return;
    setLoading(true);
    setError(null);
    try {
      const convDocRef = doc(db, "chatConversations", chatId);
      await updateDoc(convDocRef, {
        status: "closed",
        updatedAt: serverTimestamp()
      });

      // Remove chatId from localStorage, but keep visitor name/email
      localStorage.removeItem("portfolio-chat-id");
      setChatId(null);
      setConversation(null);
      setMessages([]);
    } catch (err: any) {
      console.error("Error ending chat:", err);
      setError("Failed to end chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear all local session keys completely
  const handleClearLocalSessionConfirm = () => {
    localStorage.removeItem("portfolio-chat-id");
    localStorage.removeItem("portfolio-visitor-id");
    localStorage.removeItem("portfolio-visitor-name");
    localStorage.removeItem("portfolio-visitor-email");

    setChatId(null);
    setConversation(null);
    setMessages([]);
  };

  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !chatId || sending) return;

    setSending(true);
    setInputText(false || "");

    // Instantly clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateDoc(doc(db, "chatConversations", chatId), { visitorTyping: false }).catch(() => {});

    try {
      const messagesRef = collection(db, "chatConversations", chatId, "messages");
      
      // 1. Add message document
      const docRef = await addDoc(messagesRef, {
        sender: "visitor",
        text: text,
        createdAt: serverTimestamp(),
        read: false,
        type: "text"
      });

      // 2. Update conversation header
      const convDocRef = doc(db, "chatConversations", chatId);
      const isOfflineNow = !isAdminOnline;
      await updateDoc(convDocRef, {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        unreadByAdmin: increment(1),
        status: isOfflineNow ? "offline_pending" : "open",
        adminOnline: !isOfflineNow
      });

      // Send email notification to admin about the new message
      sendEmailNotification({
        visitorName: conversation?.visitorName || "Anonymous",
        visitorEmail: conversation?.visitorEmail || "",
        projectType: conversation?.projectType,
        message: text,
        conversationId: chatId,
        timestamp: new Date().toLocaleString(),
        sender: "visitor",
        messageId: docRef.id
      });

    } catch (err: any) {
      console.error("Error sending message:", err);
      setError("Message failed to send. Please retry.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-text-primary">
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-button"
            onClick={handleOpenWidget}
            className={isCyberpunk ? "flex items-center justify-center w-14 h-14 rounded-full bg-[#0B0B16] text-[#00E5FF] hover:text-[#E60094] shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(230,0,148,0.5)] cursor-pointer relative border border-[#00E5FF]/45" : "flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-brand-purple to-neon-purple hover:brightness-110 text-white shadow-[0_4px_20px_rgba(168,85,247,0.35)] cursor-pointer relative border border-white/10"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <MessageSquare size={24} />
            {hasUnread && (
              <span className={`absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full animate-pulse border-2 ${isCyberpunk ? "bg-[#00E5FF] border-[#0B0B16] shadow-[0_0_8px_#00E5FF]" : "bg-red-500 border-white"}`} />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={`w-[360px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-100px)] rounded-2xl shadow-2xl flex flex-col overflow-hidden sm:w-[380px] sm:h-[550px] md:w-[400px] ${
              isCyberpunk 
                ? "bg-[#0B0B16]/95 border border-[#00F5FF]/45 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,245,255,0.15)] font-mono text-xs" 
                : "bg-bg-card border border-border-primary font-sans text-text-primary"
            }`}
          >
            {/* Header */}
            <div className={`px-4 py-3 flex items-center justify-between ${isCyberpunk ? "bg-[#05010A]/85 border-b border-[#00E5FF]/30" : "bg-brand-soft-bg border-b border-border-primary/80"}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center relative`}>
                  {isAdminOnline ? (
                    <>
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-400" />
                  )}
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isCyberpunk ? "text-[#00E5FF] font-space" : "text-text-primary font-black"}`}>
                    Leanur Live Chat
                  </h4>
                  <p className={`text-[10px] flex items-center gap-1 ${isCyberpunk ? "text-white/50 font-space" : "text-text-secondary font-mono"}`}>
                    {formatLastSeen()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 relative">
                {/* Options Menu Toggle */}
                <button
                  id="chat-options-menu-btn"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isCyberpunk 
                      ? isMenuOpen ? "bg-white/10 text-[#00E5FF]" : "text-white/60 hover:bg-white/5 hover:text-white"
                      : isMenuOpen ? "bg-bg-primary/80 text-neon-purple" : "hover:bg-bg-primary/60 text-text-secondary"
                  }`}
                  title="Chat Options"
                >
                  <MoreVertical size={14} />
                </button>
                
                {/* Options Dropdown */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      {/* Invisible backdrop to close menu when clicking outside */}
                      <div 
                        id="chat-options-backdrop"
                        className="fixed inset-0 z-40 cursor-default" 
                        onClick={() => setIsMenuOpen(false)} 
                      />
                      <motion.div
                        id="chat-options-dropdown"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={`absolute right-0 top-full mt-1.5 w-44 rounded-xl shadow-xl py-1 z-50 text-left ${
                          isCyberpunk 
                            ? "bg-[#0B0B16] border border-[#00E5FF]/45 font-space text-white backdrop-blur-md" 
                            : "bg-bg-card border border-border-primary font-sans text-text-primary"
                        }`}
                      >
                        <button
                          id="menu-item-new-chat"
                          disabled={!chatId}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setConfirmModal({ isOpen: true, type: "new" });
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-colors font-medium ${
                            isCyberpunk 
                              ? "text-white/80 hover:bg-[#00E5FF]/10 hover:text-white disabled:opacity-30" 
                              : "hover:bg-brand-soft-bg text-text-primary disabled:opacity-40"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          New Chat
                        </button>
                        <button
                          id="menu-item-end-chat"
                          disabled={!chatId}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setConfirmModal({ isOpen: true, type: "end" });
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-colors font-medium ${
                            isCyberpunk 
                              ? "text-white/80 hover:bg-[#00E5FF]/10 hover:text-white disabled:opacity-30" 
                              : "hover:bg-brand-soft-bg text-text-primary disabled:opacity-40"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          End Chat
                        </button>
                        <div className={`my-1 border-t ${isCyberpunk ? "border-white/10" : "border-border-primary/60"}`} />
                        <button
                          id="menu-item-clear-session"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setConfirmModal({ isOpen: true, type: "clear" });
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 cursor-pointer transition-colors font-medium ${
                            isCyberpunk 
                              ? "text-white/80 hover:bg-[#00E5FF]/10 hover:text-white" 
                              : "hover:bg-brand-soft-bg text-text-primary"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          Clear Local Session
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                <button
                  id="chat-widget-minimize-btn"
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isCyberpunk ? "text-white/60 hover:bg-white/5 hover:text-white" : "hover:bg-bg-primary/60 text-text-secondary"}`}
                >
                  <Minimize2 size={14} />
                </button>
                <button
                  id="chat-widget-close-btn"
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isCyberpunk ? "text-white/60 hover:bg-white/5 hover:text-white" : "hover:bg-bg-primary/60 text-text-secondary"}`}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-red-500 text-[11px] font-mono flex items-center gap-1.5">
                <AlertCircle size={12} className="shrink-0" />
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)} className="hover:text-red-600 font-bold">×</button>
              </div>
            )}

            {/* Content body */}
            <div className={`flex-1 overflow-y-auto p-4 ${isCyberpunk ? "bg-black/45" : "bg-bg-primary/30"}`}>
              {!chatId ? (
                /* Start form if no active chat */
                <div className="h-full flex flex-col justify-center">
                  <div className="text-center px-4 mb-3 space-y-1">
                    <h5 className={`text-sm font-bold ${isCyberpunk ? "text-[#00E5FF] font-space" : "text-text-primary"}`}>Connect with Leanur</h5>
                    <p className={`text-xs font-light ${isCyberpunk ? "text-white/70" : "text-text-secondary"}`}>
                      {!isAdminOnline ? (
                        <span className={`${isCyberpunk ? "text-[#E60094]" : "text-neon-purple"} font-medium`}>I’m currently offline. Leave your message and I’ll reply soon.</span>
                      ) : (
                        welcomeMsg
                      )}
                    </p>
                  </div>
                  <ChatStartForm
                    onSubmit={handleStartChat}
                    loading={loading}
                    defaultName={localStorage.getItem("portfolio-visitor-name") || ""}
                    defaultEmail={localStorage.getItem("portfolio-visitor-email") || ""}
                  />
                </div>
              ) : loading ? (
                /* Loading state */
                <div className="h-full flex flex-col items-center justify-center gap-2 text-text-muted">
                  <Loader2 size={24} className={`animate-spin ${isCyberpunk ? "text-[#00E5FF]" : "text-neon-purple"}`} />
                  <span className={`text-[10px] uppercase tracking-wider ${isCyberpunk ? "font-space text-[#00E5FF]" : "font-mono"}`}>Retrieving History...</span>
                </div>
              ) : (
                /* Real-time message thread */
                <div className="space-y-1">
                  {/* Offline Message Notice (if offline) */}
                  {!isAdminOnline && (
                    <div className={`mb-4 p-3 rounded-xl text-center space-y-1 border ${
                      isCyberpunk 
                        ? "bg-[#E60094]/5 border-[#E60094]/25" 
                        : "bg-brand-purple/5 border border-brand-purple/20"
                    }`}>
                      <div className={`flex items-center justify-center gap-1.5 text-xs font-semibold ${isCyberpunk ? "text-[#E60094]" : "text-neon-purple"}`}>
                        <WifiOff size={13} />
                        <span>Admin is offline</span>
                      </div>
                      <p className={`text-[10px] leading-relaxed ${isCyberpunk ? "text-white/60 font-sans" : "text-text-secondary"}`}>
                        I’m currently offline. Leave your message and I’ll reply soon.
                      </p>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                  ))}

                  {/* Real-time typing status bubble */}
                  {conversation?.adminTyping && (
                    <div className="flex items-center gap-1.5 ml-2 mt-1 py-1">
                      <div className={`flex gap-1 px-3 py-2 rounded-2xl rounded-tl-none border ${
                        isCyberpunk 
                          ? "bg-black/40 border-[#00F5FF]/35" 
                          : "bg-bg-secondary border-border-primary/60"
                      }`}>
                        <span 
                          className={`w-1.5 h-1.5 rounded-full animate-bounce ${isCyberpunk ? "bg-[#00F5FF] shadow-[0_0_6px_#00F5FF]" : "bg-neon-purple"}`} 
                          style={{ animationDelay: "0ms" }} 
                        />
                        <span 
                          className={`w-1.5 h-1.5 rounded-full animate-bounce ${isCyberpunk ? "bg-[#00F5FF] shadow-[0_0_6px_#00F5FF]" : "bg-neon-purple"}`} 
                          style={{ animationDelay: "150ms" }} 
                        />
                        <span 
                          className={`w-1.5 h-1.5 rounded-full animate-bounce ${isCyberpunk ? "bg-[#00F5FF] shadow-[0_0_6px_#00F5FF]" : "bg-neon-purple"}`} 
                          style={{ animationDelay: "300ms" }} 
                        />
                      </div>
                      <span className={`text-[9px] font-mono ${isCyberpunk ? "text-[#00F5FF]" : "text-text-muted"}`}>Admin typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Footer */}
            {chatId && !loading && (
              <form
                onSubmit={handleSendMessage}
                className={`p-3 flex items-center gap-2 ${
                  isCyberpunk ? "bg-[#05010A]/85 border-t border-[#00E5FF]/30" : "bg-bg-card border-t border-border-primary/80"
                }`}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder={!isAdminOnline ? "Leave an offline message..." : "Type your message..."}
                  disabled={sending}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none transition-all ${
                    isCyberpunk 
                      ? "bg-black/40 border border-white/10 text-white focus:border-[#00E5FF] placeholder:text-white/30 font-sans" 
                      : "bg-bg-primary border border-border-primary text-text-primary focus:border-neon-purple placeholder:text-text-muted/60 font-sans"
                  }`}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className={`p-2.5 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all ${
                    isCyberpunk 
                      ? "bg-gradient-to-r from-[#E60094] to-[#7300E6] text-white" 
                      : "bg-gradient-to-r from-brand-purple to-neon-purple text-white hover:brightness-110"
                  }`}
                >
                  {sending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </motion.button>
              </form>
            )}

            {/* Confirmation Modal Overlay */}
            <AnimatePresence>
              {confirmModal.isOpen && (
                <motion.div
                  id="confirm-modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
                >
                  <motion.div
                    id="confirm-modal-box"
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className={`rounded-2xl p-5 max-w-[90%] w-[310px] shadow-2xl space-y-4 text-center border ${
                      isCyberpunk 
                        ? "bg-[#0B0B16] border-[#00E5FF]/45 text-white font-space" 
                        : "bg-bg-card border-border-primary text-text-primary font-sans"
                    }`}
                  >
                    <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${
                      isCyberpunk ? "bg-[#E60094]/10 text-[#E60094]" : "bg-brand-purple/10 text-neon-purple"
                    }`}>
                      <AlertCircle size={20} />
                    </div>
                    <div className="space-y-1">
                      <h5 className={`text-sm font-bold ${isCyberpunk ? "text-[#00E5FF]" : "text-text-primary"}`}>
                        {confirmModal.type === "new" && "Start New Chat?"}
                        {confirmModal.type === "end" && "End This Chat?"}
                        {confirmModal.type === "clear" && "Clear Local Session?"}
                      </h5>
                      <p className={`text-xs leading-relaxed font-light text-left ${isCyberpunk ? "text-white/80" : "text-text-secondary"}`}>
                        {confirmModal.type === "new" && (
                          <>
                            Are you sure you want to start a new chat? Your current conversation will remain saved for the admin.
                            <span className={`block mt-2 text-[10px] rounded-lg px-2.5 py-1.5 leading-normal text-left border ${
                              isCyberpunk 
                                ? "bg-[#E60094]/5 border-[#E60094]/20 text-[#E60094]" 
                                : "bg-brand-purple/10 border-brand-purple/20 text-neon-purple"
                            }`}>
                              Starting a new chat won’t delete your previous conversation.
                            </span>
                          </>
                        )}
                        {confirmModal.type === "end" && (
                          "Are you sure you want to end this chat? Previous messages will not be shown on your side, but remains in the admin panel."
                        )}
                        {confirmModal.type === "clear" && (
                          "This will remove your local chat history and stored details. Your messages will remain in Firestore for the admin."
                        )}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        id="confirm-modal-cancel-btn"
                        onClick={() => setConfirmModal({ isOpen: false, type: null })}
                        className={`px-3 py-2 border rounded-xl text-xs font-medium cursor-pointer transition-all ${
                          isCyberpunk 
                            ? "bg-black/40 border-white/10 text-white hover:bg-white/5" 
                            : "bg-bg-primary hover:bg-bg-secondary text-text-primary border-border-primary"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        id="confirm-modal-confirm-btn"
                        onClick={() => {
                          if (confirmModal.type === "new") handleNewChatConfirm();
                          else if (confirmModal.type === "end") handleEndChatConfirm();
                          else if (confirmModal.type === "clear") handleClearLocalSessionConfirm();
                          setConfirmModal({ isOpen: false, type: null });
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          isCyberpunk 
                            ? "bg-gradient-to-r from-[#E60094] to-[#7300E6] text-white hover:brightness-110" 
                            : "bg-gradient-to-r from-brand-purple to-neon-purple text-white hover:brightness-110"
                        }`}
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ChatWidget;
