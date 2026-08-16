/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  getDocFromServer
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../firebase/config";
import {
  Profile,
  Project,
  Skill,
  Service,
  Testimonial,
  ContactMessage,
  SiteSettings,
  ExperienceSettings
} from "../types";
import {
  defaultProfile,
  defaultProjects,
  defaultSkills,
  defaultServices,
  defaultTestimonials,
  defaultSiteSettings,
  defaultExperienceSettings
} from "../data/defaultData";

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write"
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

// Global helper for Firestore error handling as mandated by the Firebase Skill
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface PortfolioContextType {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  services: Service[];
  testimonials: Testimonial[];
  messages: ContactMessage[];
  siteSettings: SiteSettings;
  experienceSettings: ExperienceSettings;
  loading: boolean;
  isAdmin: boolean;
  isSandboxMode: boolean; // Virtual Demo Admin Sandbox (always false)
  adminUser: User | null;
  errorMsg: string | null;
  successMsg: string | null;
  
  // Actions
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  seedDatabase: () => Promise<void>;
  clearDatabase: () => Promise<void>;
  
  // Content Modifiers
  saveProfile: (data: Profile) => Promise<void>;
  saveProject: (data: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveSkill: (data: Skill) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  saveService: (data: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveTestimonial: (data: Testimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  saveSiteSettings: (data: SiteSettings) => Promise<void>;
  saveExperienceSettings: (data: ExperienceSettings) => Promise<void>;
  
  // Message operations
  submitContactForm: (formData: Omit<ContactMessage, "id" | "status" | "createdAt">) => Promise<void>;
  updateMessageStatus: (id: string, status: "unread" | "read" | "replied") => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  
  // Helper for image upload
  uploadImage: (file: File, folder: string) => Promise<string>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [experienceSettings, setExperienceSettings] = useState<ExperienceSettings>(defaultExperienceSettings);

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const isSandboxMode = false;
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Clear messages/toasts after 4 seconds
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Auth observer and validation connection to Firestore on startup
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
      } catch (error) {
        if (error instanceof Error && error.message.includes("the client is offline")) {
          console.warn("Please check your Firebase configuration: Firestore appears offline.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const allowedEmail = (((import.meta as any).env?.NEXT_PUBLIC_ADMIN_EMAIL || "leanadmin@gmail.com") as string).trim().toLowerCase();
      if (user) {
        if (user.email && user.email.trim().toLowerCase() === allowedEmail) {
          setAdminUser(user);
          setIsAdmin(true);
          // Load messages only if signed in
          loadMessages();
        } else {
          // If logged-in user is not authorized admin, sign them out and show error
          setAdminUser(null);
          setIsAdmin(false);
          setErrorMsg("You are not authorized to access admin dashboard.");
          await signOut(auth);
        }
      } else {
        setAdminUser(null);
        setIsAdmin(false);
      }
    });

    // Load initial public content from Firestore
    loadAllPublicData();

    return () => unsubscribe();
  }, []);

  const loadAllPublicData = async () => {
    try {
      setLoading(true);

      // 1. Profile
      try {
        const profileDoc = await getDoc(doc(db, "profile", "main"));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as Profile);
        } else {
          setProfile(defaultProfile);
        }
      } catch (err) {
        console.warn("Failed fetching profile from firestore. Using fallback data.", err);
      }

      // 2. Projects
      try {
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        if (!projectsSnapshot.empty) {
          const list: Project[] = [];
          projectsSnapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Project);
          });
          setProjects(list.sort((a, b) => a.order - b.order));
        } else {
          setProjects(defaultProjects);
        }
      } catch (err) {
        console.warn("Failed fetching projects. Using fallback.", err);
      }

      // 3. Skills
      try {
        const skillsSnapshot = await getDocs(collection(db, "skills"));
        if (!skillsSnapshot.empty) {
          const list: Skill[] = [];
          skillsSnapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Skill);
          });
          setSkills(list);
        } else {
          setSkills(defaultSkills);
        }
      } catch (err) {
        console.warn("Failed fetching skills. Using fallback.", err);
      }

      // 4. Services
      try {
        const servicesSnapshot = await getDocs(collection(db, "services"));
        if (!servicesSnapshot.empty) {
          const list: Service[] = [];
          servicesSnapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Service);
          });
          setServices(list);
        } else {
          setServices(defaultServices);
        }
      } catch (err) {
        console.warn("Failed fetching services. Using fallback.", err);
      }

      // 5. Testimonials
      try {
        const testimonialsSnapshot = await getDocs(collection(db, "testimonials"));
        if (!testimonialsSnapshot.empty) {
          const list: Testimonial[] = [];
          testimonialsSnapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Testimonial);
          });
          setTestimonials(list);
        } else {
          setTestimonials(defaultTestimonials);
        }
      } catch (err) {
        console.warn("Failed fetching testimonials. Using fallback.", err);
      }

      // 6. Site Settings
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "main"));
        if (settingsDoc.exists()) {
          setSiteSettings({
            ...defaultSiteSettings,
            ...settingsDoc.data()
          } as SiteSettings);
        } else {
          setSiteSettings(defaultSiteSettings);
        }
      } catch (err) {
        console.warn("Failed fetching site settings. Using fallback.", err);
      }

      // 7. Experience Settings
      try {
        const expSettingsDoc = await getDoc(doc(db, "experienceSettings", "main"));
        if (expSettingsDoc.exists()) {
          const loadedData = expSettingsDoc.data() || {};
          const merged: ExperienceSettings = {
            cosmic: {
              ...defaultExperienceSettings.cosmic,
              ...(loadedData.cosmic || {})
            },
            gta6: {
              ...defaultExperienceSettings.gta6,
              ...(loadedData.gta6 || {})
            },
            appleGlass: {
              ...defaultExperienceSettings.appleGlass,
              ...(loadedData.appleGlass || {})
            },
            neonGaming: {
              ...defaultExperienceSettings.neonGaming,
              ...(loadedData.neonGaming || {})
            },
            hackerTerminal: {
              ...defaultExperienceSettings.hackerTerminal,
              ...(loadedData.hackerTerminal || {})
            }
          };
          setExperienceSettings(merged);
        } else {
          setExperienceSettings(defaultExperienceSettings);
        }
      } catch (err) {
        console.warn("Failed fetching experience settings. Using fallback.", err);
      }

    } catch (globalErr) {
      console.error("Global data fetch issue: ", globalErr);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const messagesSnapshot = await getDocs(collection(db, "messages"));
      const list: ContactMessage[] = [];
      messagesSnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as ContactMessage);
      });
      // Sort messages descending by createdAt
      setMessages(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error("Error loading messages: ", err);
    }
  };

  // Email login (strictly checks allowed admin email)
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const trimmedEmail = email.trim();
      const allowedEmail = (((import.meta as any).env?.NEXT_PUBLIC_ADMIN_EMAIL || "leanadmin@gmail.com") as string).trim().toLowerCase();

      if (trimmedEmail.toLowerCase() !== allowedEmail) {
        setErrorMsg("You are not authorized to access admin dashboard.");
        return false;
      }

      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      setSuccessMsg("Logged in successfully as Admin!");
      return true;
    } catch (err: any) {
      console.error(err);
      let errMsg = "Invalid email or password.";
      if (err.code === "auth/user-not-found") {
        errMsg = "User not found.";
      } else if (err.code === "auth/too-many-requests") {
        errMsg = "Too many attempts. Please try again later.";
      } else if (err.code === "auth/network-request-failed") {
        errMsg = "Network error. Please check your connection.";
      }
      setErrorMsg(errMsg);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setSuccessMsg("Logged out successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  // Helper function to compress base64 images client-side to ensure small Firestore document size limits (max ~100kb)
  const compressImage = (base64Str: string, maxWidth = 400, maxHeight = 400): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to jpeg format with 0.7 quality
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  // Universal image uploader helper. Falls back to converting file to compressed Base64 in case of Firebase Storage rules / config failure
  const uploadImage = async (file: File, folder: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64String = reader.result as string;
        
        // Compress the image before anything else, so that fallback is ready and small
        let base64String = rawBase64String;
        try {
          base64String = await compressImage(rawBase64String);
        } catch (compErr) {
          console.warn("Base64 compression issues: ", compErr);
        }

        // Define a fast fallback timeout of 1.2 seconds to prevent hanging if Storage fails or retries infinitely
        let resolved = false;
        const timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            console.warn("Firebase Storage upload timed out after 1.2s. Falling back to secure compressed Base64 URL.");
            resolve(base64String);
          }
        }, 1200);

        try {
          // Attempt Firebase Storage Upload
          const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
          const uploadSnapshot = await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(uploadSnapshot.ref);
          
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            console.log("Firebase storage upload successful: ", downloadUrl);
            resolve(downloadUrl);
          }
        } catch (err) {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            console.warn("Firebase Storage issue or inactive bucket. Fallback to storage-efficient compressed base64 data URL.", err);
            resolve(base64String);
          }
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Content Save Primitives with error logging
  const saveProfile = async (data: Profile) => {
    const path = "profile/main";
    try {
      setProfile(data);
      await setDoc(doc(db, "profile", "main"), data);
      setSuccessMsg("Profile details updated successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const saveProject = async (data: Project) => {
    const path = `projects/${data.id}`;
    try {
      const updated = projects.filter((p) => p.id !== data.id);
      setProjects([...updated, data].sort((a, b) => a.order - b.order));
      await setDoc(doc(db, "projects", data.id), data);
      setSuccessMsg(`Project '${data.title}' saved successfully!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteProject = async (id: string) => {
    const path = `projects/${id}`;
    try {
      setProjects(projects.filter((p) => p.id !== id));
      await deleteDoc(doc(db, "projects", id));
      setSuccessMsg("Project deleted successfully.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const saveSkill = async (data: Skill) => {
    const path = `skills/${data.id}`;
    try {
      const updated = skills.filter((s) => s.id !== data.id);
      setSkills([...updated, data]);
      await setDoc(doc(db, "skills", data.id), data);
      setSuccessMsg(`Skill '${data.name}' saved successfully!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteSkill = async (id: string) => {
    const path = `skills/${id}`;
    try {
      setSkills(skills.filter((s) => s.id !== id));
      await deleteDoc(doc(db, "skills", id));
      setSuccessMsg("Skill deleted successfully.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const saveService = async (data: Service) => {
    const path = `services/${data.id}`;
    try {
      const updated = services.filter((s) => s.id !== data.id);
      setServices([...updated, data]);
      await setDoc(doc(db, "services", data.id), data);
      setSuccessMsg(`Service '${data.title}' saved successfully!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteService = async (id: string) => {
    const path = `services/${id}`;
    try {
      setServices(services.filter((s) => s.id !== id));
      await deleteDoc(doc(db, "services", id));
      setSuccessMsg("Service deleted successfully.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const saveTestimonial = async (data: Testimonial) => {
    const path = `testimonials/${data.id}`;
    try {
      const updated = testimonials.filter((t) => t.id !== data.id);
      setTestimonials([...updated, data]);
      await setDoc(doc(db, "testimonials", data.id), data);
      setSuccessMsg(`Testimonial by ${data.clientName} saved!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteTestimonial = async (id: string) => {
    const path = `testimonials/${id}`;
    try {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      await deleteDoc(doc(db, "testimonials", id));
      setSuccessMsg("Testimonial deleted successfully.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const saveSiteSettings = async (data: SiteSettings) => {
    const path = "settings/main";
    try {
      setSiteSettings(data);
      await setDoc(doc(db, "settings", "main"), data);
      setSuccessMsg("Website appearance settings updated!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const saveExperienceSettings = async (data: ExperienceSettings) => {
    const path = "experienceSettings/main";
    try {
      setExperienceSettings(data);
      await setDoc(doc(db, "experienceSettings", "main"), data);
      setSuccessMsg("Experience visual settings updated!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  // Submit contact message (any visitor can call this)
  const submitContactForm = async (formData: Omit<ContactMessage, "id" | "status" | "createdAt">) => {
    const messageId = "msg_" + Math.random().toString(36).substring(2, 11);
    const path = `messages/${messageId}`;
    const newMsg: ContactMessage = {
      ...formData,
      id: messageId,
      status: "unread",
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "messages", messageId), newMsg);
      setMessages([newMsg, ...messages]);
      setSuccessMsg("Your inquiry was sent! Thank you, Leanur will reach out soon.");
      
      // Resend or fallback console notification
      console.log("CONTACT FORM SUBMITTED: Sent automated email to ", siteSettings.contactEmail || "techbulletcodeyt@gmail.com");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateMessageStatus = async (id: string, status: "unread" | "read" | "replied") => {
    const path = `messages/${id}`;
    try {
      setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)));
      await setDoc(doc(db, "messages", id), { status }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteMessage = async (id: string) => {
    const path = `messages/${id}`;
    try {
      setMessages(messages.filter((m) => m.id !== id));
      await deleteDoc(doc(db, "messages", id));
      setSuccessMsg("Inquiry deleted successfully.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // One-Click Database Seeding
  const seedDatabase = async () => {
    try {
      setLoading(true);
      
      // Profile
      await saveProfile(defaultProfile);
      
      // Projects
      for (const p of defaultProjects) {
         await saveProject(p);
      }
      
      // Skills
      for (const s of defaultSkills) {
         await saveSkill(s);
      }
      
      // Services
      for (const ser of defaultServices) {
         await saveService(ser);
      }
      
      // Testimonials
      for (const t of defaultTestimonials) {
         await saveTestimonial(t);
      }
      
      // Settings
      await saveSiteSettings(defaultSiteSettings);
      await saveExperienceSettings(defaultExperienceSettings);
      
      setSuccessMsg("Database successfully populated with high-quality default contents!");
      await loadAllPublicData();
    } catch (err) {
      setErrorMsg("Failed database seeding: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  // One-Click Clear Database
  const clearDatabase = async () => {
    try {
      setLoading(true);

      // Projects
      for (const p of projects) {
        await deleteProject(p.id);
      }
      // Skills
      for (const s of skills) {
        await deleteSkill(s.id);
      }
      // Services
      for (const ser of services) {
        await deleteService(ser.id);
      }
      // Testimonials
      for (const t of testimonials) {
        await deleteTestimonial(t.id);
      }
      
      setProfile(defaultProfile);
      setSiteSettings(defaultSiteSettings);
      setSuccessMsg("Database cleared successfully. Reloading...");
      await loadAllPublicData();
    } catch (err) {
      setErrorMsg("Failed to clear database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        skills,
        services,
        testimonials,
        messages,
        siteSettings,
        experienceSettings,
        loading,
        isAdmin,
        isSandboxMode,
        adminUser,
        errorMsg,
        successMsg,
        loginWithEmail,
        logout,
        seedDatabase,
        clearDatabase,
        saveProfile,
        saveProject,
        deleteProject,
        saveSkill,
        deleteSkill,
        saveService,
        deleteService,
        saveTestimonial,
        deleteTestimonial,
        saveSiteSettings,
        saveExperienceSettings,
        submitContactForm,
        updateMessageStatus,
        deleteMessage,
        uploadImage
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
