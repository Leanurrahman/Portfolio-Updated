/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  increment,
  writeBatch,
  getDocs,
  setDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import { ChatConversation, ChatMessage } from "../types";
import {
  MessageSquare,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Send,
  Loader2,
  X,
  Bell,
  MessageCircle,
  FolderOpen,
  Volume2,
  VolumeX,
  ShieldCheck,
  ShieldAlert,
  User,
  Activity,
  Check,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminChatsPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Custom filter options: All, Unread, Online visitors, Offline pending, Closed
  const [filter, setFilter] = useState<"all" | "unread" | "online_visitors" | "offline_pending" | "closed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);

  // Mute preference state
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem("portfolio-admin-mute") === "true";
  });

  // Browser notification permission state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "denied";
  });
  
  // Notification Toast state
  const [notification, setNotification] = useState<{
    id: string;
    visitorName: string;
    text: string;
  } | null>(null);

  // Modal confirmation for deletion
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevConversationsRef = useRef<ChatConversation[]>([]);
  const adminTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConv?.visitorTyping]);

  // Request browser notification permissions
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  // Web Audio API custom synth chime generator (guarantees a pristine chime without files)
  const playNotificationChime = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Node 1: Bell ping
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc1.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12); // E6
      gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      
      // Node 2: Warm fundamental
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      gain2.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc1.start(audioCtx.currentTime);
      osc2.start(audioCtx.currentTime);
      
      osc1.stop(audioCtx.currentTime + 0.35);
      osc2.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn("AudioContext blocked or failed to play:", e);
    }
  };

  // Update mute setting
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem("portfolio-admin-mute", String(nextMuted));
  };

  // Real-time conversation list fetcher
  useEffect(() => {
    const colRef = collection(db, "chatConversations");
    const q = query(colRef, orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ChatConversation[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as ChatConversation);
        });

        // 1. Detect new visitor messages for notifications
        if (prevConversationsRef.current.length > 0) {
          list.forEach((newConv) => {
            const oldConv = prevConversationsRef.current.find((c) => c.id === newConv.id);
            // ONLY play sound/notify if the last message was sent by a visitor
            // and the unread count by admin increased
            const isNewVisitorMsg =
              newConv.lastMessage &&
              newConv.lastMessageSender === "visitor" &&
              newConv.unreadByAdmin > 0 &&
              (!oldConv || newConv.unreadByAdmin > oldConv.unreadByAdmin);

            if (isNewVisitorMsg) {
              // Play a light synth-like notification sound
              playNotificationChime();

              // Trigger native browser notification if allowed
              if (Notification.permission === "granted") {
                try {
                  new Notification(`📩 New portfolio chat message`, {
                    body: `${newConv.visitorName}: ${newConv.lastMessage}`,
                    icon: "/favicon.ico"
                  });
                } catch (e) {
                  console.error("Failed to trigger browser notification:", e);
                }
              }

              // Fallback/parallel in-app banner toast notification
              setNotification({
                id: newConv.id,
                visitorName: newConv.visitorName,
                text: newConv.lastMessage
              });
            }
          });
        }

        prevConversationsRef.current = list;
        setConversations(list);
        setLoadingConv(false);

        // Keep selected metadata updated in real-time
        if (selectedId) {
          const currentSelected = list.find((c) => c.id === selectedId);
          if (currentSelected) {
            setSelectedConv(currentSelected);
          }
        }
      },
      (error) => {
        console.error("Error listening to chats:", error);
        setLoadingConv(false);
      }
    );

    return () => unsubscribe();
  }, [selectedId, isMuted]);

  // Real-time messages fetcher for selected thread
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      setSelectedConv(null);
      return;
    }

    setLoadingMsgs(true);

    const messagesRef = collection(db, "chatConversations", selectedId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgsList: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          msgsList.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
        });
        setMessages(msgsList);
        setLoadingMsgs(false);

        // Automatically mark all visitor messages as read in this thread
        const unreadVisitorMsgs = snapshot.docs.filter(
          (d) => (d.data().sender === "visitor") && !d.data().read
        );

        if (unreadVisitorMsgs.length > 0) {
          const batch = writeBatch(db);
          unreadVisitorMsgs.forEach((d) => {
            batch.update(doc(db, "chatConversations", selectedId, "messages", d.id), { read: true });
          });
          batch.commit().catch(console.error);

          // Clear unread badge header on conversation metadata
          updateDoc(doc(db, "chatConversations", selectedId), { unreadByAdmin: 0 }).catch(console.error);
        }
      },
      (error) => {
        console.error("Error listening to messages:", error);
        setLoadingMsgs(false);
      }
    );

    return () => unsubscribe();
  }, [selectedId]);

  // Track admin typing status on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (!selectedId) return;

    // Set typing indicator to true
    updateDoc(doc(db, "chatConversations", selectedId), { adminTyping: true }).catch(() => {});

    if (adminTypingTimeoutRef.current) {
      clearTimeout(adminTypingTimeoutRef.current);
    }

    // Debounce to clear typing indicator after 2 seconds
    adminTypingTimeoutRef.current = setTimeout(() => {
      updateDoc(doc(db, "chatConversations", selectedId), { adminTyping: false }).catch(() => {});
    }, 2000);
  };

  // Clean up typing status on unmount or conversation change
  useEffect(() => {
    return () => {
      if (adminTypingTimeoutRef.current) {
        clearTimeout(adminTypingTimeoutRef.current);
      }
      if (selectedId) {
        updateDoc(doc(db, "chatConversations", selectedId), { adminTyping: false }).catch(() => {});
      }
    };
  }, [selectedId]);

  // Actions
  const handleSelectChat = (conv: ChatConversation) => {
    setSelectedId(conv.id);
    setSelectedConv(conv);
    
    // Reset unread count immediately in Firestore
    if (conv.unreadByAdmin > 0) {
      updateDoc(doc(db, "chatConversations", conv.id), { unreadByAdmin: 0 }).catch(console.error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !selectedId || sending) return;

    setSending(true);
    setInputText("");

    // Clear typing status instantly
    if (adminTypingTimeoutRef.current) {
      clearTimeout(adminTypingTimeoutRef.current);
    }
    updateDoc(doc(db, "chatConversations", selectedId), { adminTyping: false }).catch(() => {});

    try {
      // 1. Add Message
      const msgsRef = collection(db, "chatConversations", selectedId, "messages");
      await addDoc(msgsRef, {
        sender: "admin",
        text,
        createdAt: serverTimestamp(),
        read: false,
        type: "text"
      });

      // 2. Update conversation header - auto re-opens conversation if closed
      await updateDoc(doc(db, "chatConversations", selectedId), {
        lastMessage: text,
        lastMessageSender: "admin",
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        unreadByVisitor: increment(1),
        status: "open"
      });
    } catch (err) {
      console.error("Failed to reply:", err);
    } finally {
      setSending(false);
    }
  };

  const handleToggleStatus = async (conv: ChatConversation, specificStatus?: "open" | "closed" | "offline_pending") => {
    let nextStatus: "open" | "closed" | "offline_pending";
    if (specificStatus) {
      nextStatus = specificStatus;
    } else {
      nextStatus = conv.status === "closed" ? "open" : "closed";
    }

    try {
      await updateDoc(doc(db, "chatConversations", conv.id), {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  const handleMarkAsRead = async (conv: ChatConversation) => {
    try {
      await updateDoc(doc(db, "chatConversations", conv.id), {
        unreadByAdmin: 0
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConversation = async () => {
    if (!deleteConfirmId) return;
    try {
      // Delete the message logs in subcollection
      const msgsSnapshot = await getDocs(collection(db, "chatConversations", deleteConfirmId, "messages"));
      const batch = writeBatch(db);
      msgsSnapshot.forEach((d) => {
        batch.delete(doc(db, "chatConversations", deleteConfirmId, "messages", d.id));
      });
      batch.delete(doc(db, "chatConversations", deleteConfirmId));
      await batch.commit();

      if (selectedId === deleteConfirmId) {
        setSelectedId(null);
        setSelectedConv(null);
        setMessages([]);
      }
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Filter & Search calculation
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.visitorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "unread") return conv.unreadByAdmin > 0;
    if (filter === "online_visitors") return conv.visitorTyping === true;
    if (filter === "offline_pending") return conv.status === "offline_pending";
    if (filter === "closed") return conv.status === "closed";

    return true;
  });

  // Timestamp Formatter
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "Just now";
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6 text-text-primary font-sans">
      {/* Upper Status Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-bg-secondary p-5 border border-border-primary rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase tracking-tight text-text-primary flex items-center gap-2">
            <MessageCircle className="text-brand-orange" />
            <span>Hybrid Admin Inbox</span>
          </h2>
          <p className="text-text-secondary text-xs font-light">
            Keep connected to visitors with real-time sync, typing statuses, sound loops, and browser dispatch.
          </p>
        </div>

        {/* Presence state + Sound state + Permission state */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Notification Permission Indicator */}
          <button
            onClick={requestNotificationPermission}
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              notificationPermission === "granted"
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                : "bg-amber-500/5 border-amber-500/20 text-amber-500 hover:bg-amber-500/10"
            }`}
          >
            {notificationPermission === "granted" ? (
              <>
                <ShieldCheck size={12} />
                <span>Notifications: On</span>
              </>
            ) : (
              <>
                <ShieldAlert size={12} />
                <span>Enable Alerts</span>
              </>
            )}
          </button>

          {/* Mute/Unmute Action */}
          <button
            onClick={toggleMute}
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              !isMuted
                ? "bg-brand-orange/5 border-brand-orange/20 text-brand-orange hover:bg-brand-orange/10"
                : "bg-zinc-500/5 border-zinc-500/20 text-text-muted hover:bg-zinc-500/10"
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX size={12} />
                <span>Muted</span>
              </>
            ) : (
              <>
                <Volume2 size={12} />
                <span>Sound: On</span>
              </>
            )}
          </button>

          {/* Admin Presence Dot */}
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Activity size={12} className="animate-pulse" />
            <span>Presence: Online</span>
          </div>
        </div>
      </div>

      {/* Visual Toast Alert */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 bg-brand-soft-bg border border-brand-orange/30 rounded-xl flex items-center justify-between gap-4 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-orange text-white rounded-lg">
                <Bell size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider font-mono">
                  New Message from {notification.visitorName}
                </h4>
                <p className="text-xs text-text-primary line-clamp-1 italic font-light">
                  "{notification.text}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const targetConv = conversations.find((c) => c.id === notification.id);
                  if (targetConv) handleSelectChat(targetConv);
                  setNotification(null);
                }}
                className="px-3 py-1 bg-brand-orange hover:bg-brand-orange-hover text-white text-[10px] font-mono rounded-lg transition-colors cursor-pointer uppercase font-bold"
              >
                Open Chat
              </button>
              <button
                onClick={() => setNotification(null)}
                className="p-1 hover:bg-bg-secondary rounded-lg text-text-muted cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Filters, search, cards list */}
        <div className={`lg:col-span-5 space-y-4 ${selectedId ? "hidden lg:block" : "block"}`}>
          
          {/* Custom Filters layout */}
          <div className="flex flex-wrap gap-1 p-1 bg-bg-secondary border border-border-primary rounded-xl w-full">
            {(["all", "unread", "online_visitors", "offline_pending", "closed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 min-w-[60px] text-center py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-brand-orange text-white font-bold shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-text-muted" size={14} />
            <input
              type="text"
              placeholder="Search by visitor details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-bg-secondary border border-border-primary rounded-xl text-xs focus:border-brand-orange focus:outline-none transition-all placeholder:text-text-muted/60 text-text-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-text-muted hover:text-text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Conversation Cards list */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {loadingConv ? (
              <div className="text-center py-12 text-text-muted space-y-2">
                <Loader2 size={24} className="animate-spin text-brand-orange mx-auto" />
                <span className="text-[10px] font-mono uppercase tracking-widest block">Synchronizing Chats...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border-primary rounded-2xl text-text-muted font-mono text-xs">
                No active conversations match filter.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedId === conv.id;
                const hasUnreadByAdmin = conv.unreadByAdmin > 0;
                
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectChat(conv)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative group flex flex-col gap-2 ${
                      isSelected
                        ? "bg-brand-soft-bg border-brand-orange/40 shadow-sm"
                        : "bg-bg-secondary border-border-primary hover:border-brand-orange/20"
                    }`}
                  >
                    {/* Visitor meta detail */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-text-primary block">
                          {conv.visitorName}
                        </span>
                        
                        {/* Live typing status on card list */}
                        {conv.visitorTyping && (
                          <span className="flex gap-0.5 bg-brand-orange/10 px-1 py-0.5 rounded text-[8px] font-mono text-brand-orange uppercase font-bold animate-pulse">
                            Typing
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {hasUnreadByAdmin && (
                          <span className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-mono font-black rounded-full animate-bounce">
                            {conv.unreadByAdmin} NEW
                          </span>
                        )}
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[7px] font-mono uppercase border ${
                          conv.status === "open"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : conv.status === "offline_pending"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : conv.status === "closed"
                            ? "bg-red-500/15 text-red-500 border-red-500/25 font-bold animate-pulse"
                            : "bg-bg-primary text-text-muted border-border-primary"
                        }`}>
                          {conv.status === "closed" ? "Closed" : conv.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Last message text */}
                    <p className={`text-xs leading-relaxed line-clamp-1 ${hasUnreadByAdmin ? "text-text-primary font-semibold" : "text-text-secondary"}`}>
                      {conv.lastMessage || "Conversation started"}
                    </p>

                    {/* Footer metadata details */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-text-muted pt-1 border-t border-border-primary/40">
                      <span className="truncate max-w-[150px]">{conv.visitorEmail}</span>
                      <span className="flex items-center gap-1 text-[8px] shrink-0">
                        <Clock size={10} />
                        {formatTime(conv.updatedAt || conv.lastMessageAt)}
                      </span>
                    </div>

                    {/* Interactive inline buttons on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity bg-bg-secondary/90 px-1 py-0.5 rounded-lg border border-border-primary">
                      {hasUnreadByAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(conv);
                          }}
                          className="p-1 hover:bg-emerald-500/10 text-emerald-500 rounded"
                          title="Mark as Read"
                        >
                          <Check size={11} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(conv.id);
                        }}
                        className="p-1 hover:bg-red-500/10 text-red-500 rounded"
                        title="Delete Chat"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Selected Chat Thread & Reply Controls */}
        <div className={`lg:col-span-7 ${!selectedId ? "hidden lg:block" : "block"}`}>
          {selectedConv ? (
            <div className="bg-bg-secondary border border-border-primary rounded-2xl flex flex-col h-[580px] overflow-hidden shadow-sm">
              {/* Thread header */}
              <div className="px-6 py-4 border-b border-border-primary bg-bg-primary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedId(null);
                      setSelectedConv(null);
                    }}
                    className="lg:hidden p-2 bg-bg-secondary text-text-primary rounded-xl border border-border-primary hover:bg-brand-soft-bg cursor-pointer flex items-center justify-center shrink-0"
                    title="Back to inbox"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black uppercase tracking-tight text-text-primary flex items-center gap-1.5">
                        <User size={14} className="text-brand-orange" />
                        <span>{selectedConv.visitorName}</span>
                      </h3>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono uppercase border ${
                      selectedConv.status === "open"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : selectedConv.status === "offline_pending"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : selectedConv.status === "closed"
                        ? "bg-red-500/15 text-red-500 border-red-500/25 font-bold animate-pulse"
                        : "bg-bg-primary text-text-muted border-border-primary"
                    }`}>
                      {selectedConv.status === "closed" ? "Closed" : selectedConv.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                    <Mail size={11} className="text-brand-orange" />
                    <a href={`mailto:${selectedConv.visitorEmail}`} className="hover:underline font-mono">
                      {selectedConv.visitorEmail}
                    </a>
                    {selectedConv.projectType && (
                      <span className="text-text-muted font-mono">
                        • Project: <span className="text-brand-orange uppercase">{selectedConv.projectType}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

                {/* Status Toggles & Quick Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Mark Read Button */}
                  {selectedConv.unreadByAdmin > 0 && (
                    <button
                      onClick={() => handleMarkAsRead(selectedConv)}
                      className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={11} />
                      <span>Mark Read</span>
                    </button>
                  )}

                  {/* Close / Reopen Toggle button */}
                  <button
                    onClick={() => handleToggleStatus(selectedConv)}
                    className={`px-2.5 py-1.5 border rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1 cursor-pointer focus:outline-none ${
                      selectedConv.status === "closed"
                        ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10"
                        : "bg-red-500/5 border-red-500/10 text-red-500 hover:bg-red-500/10"
                    }`}
                  >
                    {selectedConv.status === "closed" ? (
                      <>
                        <CheckCircle size={11} />
                        <span>Reopen Chat</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={11} />
                        <span>Close Chat</span>
                      </>
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirmId(selectedConv.id)}
                    className="p-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 rounded-lg cursor-pointer"
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Message scroll thread body */}
              <div className="flex-1 overflow-y-auto bg-bg-primary/20 p-6 space-y-4">
                {loadingMsgs ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-text-muted">
                    <Loader2 size={24} className="animate-spin text-brand-orange" />
                    <span className="text-[10px] font-mono">Retrieving messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-text-muted text-xs font-mono">
                    No messages inside this chat.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSystem = msg.sender === "system" || msg.sender === "admin_auto";
                    const isAdminSender = msg.sender === "admin";
                    
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdminSender ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          {isSystem && (
                            <span className="text-[8px] font-mono text-text-muted uppercase font-bold bg-bg-primary px-1 rounded">
                              Auto Response
                            </span>
                          )}
                          <span className="text-[9px] text-text-muted font-mono">
                            {formatTime(msg.createdAt)}
                          </span>
                          {msg.read && isAdminSender && (
                            <span className="text-[8px] font-mono text-emerald-500 uppercase font-black">
                              Read
                            </span>
                          )}
                        </div>

                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isAdminSender
                              ? "bg-brand-orange text-white rounded-tr-none shadow-sm"
                              : isSystem
                              ? "bg-bg-primary border border-border-primary text-text-muted rounded-tl-none italic shadow-sm"
                              : "bg-bg-primary text-text-primary border border-border-primary/50 rounded-tl-none shadow-sm"
                          }`}
                          style={{ wordBreak: "break-word" }}
                        >
                          <div className="font-semibold text-[9px] uppercase tracking-wider mb-0.5 text-white/85 dark:text-text-primary/70">
                            {isAdminSender ? "You" : isSystem ? "Auto Welcome message" : selectedConv.visitorName}
                          </div>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Real-time typing status of visitor */}
                {selectedConv.visitorTyping && (
                  <div className="flex items-center gap-1.5 mt-1 py-1">
                    <div className="flex gap-1 bg-bg-primary border border-border-primary/50 px-3 py-2 rounded-2xl rounded-tl-none">
                      <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[9px] text-text-muted font-mono">{selectedConv.visitorName} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Reply field footer */}
              <div className="p-4 bg-bg-primary/50 border-t border-border-primary">
                {selectedConv.status === "closed" && (
                  <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] rounded-lg text-center font-mono">
                    ⚠️ Conversation closed. Replying will automatically re-open it.
                  </div>
                )}
                {selectedConv.status === "offline_pending" && (
                  <div className="mb-3 p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] rounded-lg text-center font-mono">
                    📥 Visitor left this message while you were offline. Responding will re-open it.
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder={`Reply to ${selectedConv.visitorName}...`}
                    disabled={sending}
                    className="flex-1 px-4 py-2.5 bg-bg-primary border border-border-primary rounded-xl text-xs focus:border-brand-orange focus:outline-none transition-all placeholder:text-text-muted/60 text-text-primary"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl flex items-center justify-center cursor-pointer font-bold disabled:opacity-40 transition-colors"
                  >
                    {sending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-bg-secondary/40 border border-dashed border-border-primary rounded-2xl flex flex-col items-center justify-center p-12 text-center text-text-muted h-[580px] space-y-4 shadow-inner">
              <div className="p-4 bg-bg-secondary rounded-2xl text-brand-orange border border-border-primary shadow-sm">
                <FolderOpen size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">No Chat Selected</h3>
                <p className="text-xs text-text-secondary max-w-xs leading-relaxed font-light">
                  Select a live visitor thread from the conversation list to review history and send replies in real-time.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-card border border-border-primary p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl text-center"
            >
              <div className="p-3 bg-red-500/10 text-red-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Delete Conversation?
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed font-light">
                  This will permanently erase all chat message logs and conversation history from Firestore. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 bg-bg-secondary hover:bg-bg-primary border border-border-primary rounded-xl text-text-primary text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConversation}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Delete Logs
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
export { AdminChatsPage };
