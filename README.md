# 🚀 Leanur Rahman — Premium Portfolio & Admin CMS

A high-performance, full-stack developer portfolio and dynamic Content Management System (CMS) engineered with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, **Google Gemini AI**, and **Firebase Firestore / Auth**.

---

## 🌟 Key Features

### 🎨 Frontend & Design Aesthetics
- **Cinematic Experiences & Theme Engine**:
  - **Cosmic Orange** (Warm obsidian & electric orange)
  - **Neon Purple** (Cyber-luxury & violet neon accents)
  - **Clean Light / Minimalist Mode** (Ultra-crisp editorial high contrast light theme)
  - **Interactive 3D Starfield & Particle Dust**: Canvas-based orbital rings, meteor trails, and physics-driven particle fields with dynamic mouse tracking.
- **Micro-Interactions & Physics**:
  - Zero-lag spring-loaded magnetic buttons and custom trailing cursor.
  - 3D parallax card tilts on project cards and service matrices.
  - Viewport-triggered animated metric counters (e.g., 35+ Projects, 18+ Modules).
- **Responsive Architecture**:
  - Fully responsive from 320px mobile viewports up to 4K ultra-wide screens.
  - Smooth hardware-accelerated 60/120 FPS transitions and off-screen `content-visibility` optimizations.

### 🛠️ Real-Time Admin Panel & Dynamic CMS
- **Complete In-Browser Control**:
  - **Profile Management**: Update bio, avatar, role, education details, social connections, and resume link.
  - **Dynamic Bento Metrics**: Add, edit, or reorder numerical highlight stats (Value, Suffix, Label) with instant live preview.
  - **Projects Showcase**: Add/edit/delete projects, tag tech stacks, set featured status, client deliverables, live demos, and GitHub repository links.
  - **Technical Skills**: Manage skill categories (Frontend, Backend, Tools), proficiency percentages, and tags.
  - **Services Matrix**: Configure service offerings, turnaround timelines, pricing tier badges, and deliverables.
  - **Client Testimonials**: Add client quotes, project ratings, avatars, and verified company badges.
  - **Contact & Inquiry Cards**: Modify the "Have a project in mind?" card, direct contact emails, availability status, custom contact rows (WhatsApp, Phone, Location), and philosophy quotes.
  - **Experience & Theme Settings**: Configure public switcher visibility, default landing themes, and special effects.
- **Communications & AI**:
  - **Inquiries Inbox**: Real-time Firestore synchronization for incoming client project proposals with status tracking (Unread / Read / Archived).
  - **Live Chat**: Interactive visitor-to-owner messaging interface.
  - **AI Assistant**: Server-side Google Gemini 2.5/Flash integration for instant AI conversations and portfolio guidance.

---

## 📂 Project Structure

```
├── .env.example              # Environment variables template
├── firestore.rules           # Firebase security rules
├── firebase-blueprint.json   # Firestore database schema definitions
├── metadata.json             # AI Studio applet metadata & permissions
├── package.json              # Dependencies and build scripts
├── server.ts                 # Express full-stack proxy & Gemini API server
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite & Tailwind configuration
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Main layout, route management & admin modal
│   ├── index.css             # Tailwind v4 directives & performance overrides
│   ├── types.ts              # Global TypeScript interfaces & schemas
│   ├── admin/                # Dynamic Admin CMS modules
│   │   ├── AdminDashboard.tsx      # Admin panel layout & navigation
│   │   ├── AdminLogin.tsx          # Secure admin auth portal
│   │   ├── ManageProfile.tsx       # Bio, education, stats & social settings
│   │   ├── ManageProjects.tsx      # CRUD for portfolio projects
│   │   ├── ManageSkills.tsx        # Skills & proficiency controls
│   │   ├── ManageServices.tsx      # Service tiers & deliverables
│   │   ├── ManageTestimonials.tsx  # Client reviews & ratings
│   │   ├── ManageMessages.tsx      # Inquiries inbox & client leads
│   │   ├── ManageChats.tsx         # Live visitor chat logs
│   │   ├── ManageSettings.tsx      # Site branding & contact cards
│   │   └── ManageExperience.tsx    # Theme engine & particle parameters
│   ├── components/           # Reusable UI components
│   │   ├── AnimatedSectionHeading.tsx
│   │   ├── BackgroundMotion.tsx
│   │   ├── CosmicBackground.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── Header.tsx
│   │   ├── LiveChatWidget.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ServiceTiltCard.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── context/
│   │   └── PortfolioContext.tsx    # Central state manager & Firestore sync
│   ├── data/
│   │   └── defaultData.ts          # Default seed dataset & fallback state
│   ├── lib/
│   │   └── firebase.ts             # Firebase client SDK initialization
│   └── sections/             # Public portfolio sections
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Skills.tsx
│       ├── Services.tsx
│       ├── Projects.tsx
│       ├── Process.tsx
│       ├── Testimonials.tsx
│       ├── Contact.tsx
│       └── Footer.tsx
```

---

## 💻 Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript 5.8](https://www.typescriptlang.org/), [Vite 6](https://vitejs.dev/)
- **Styling & Design**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Animations & Motion**: [Framer Motion / Motion 12](https://motion.dev/), [GSAP 3](https://greensock.com/gsap/)
- **Database & Auth**: [Firebase Firestore](https://firebase.google.com/products/firestore), [Firebase Authentication](https://firebase.google.com/products/auth)
- **AI Engine**: [Google Gen AI SDK (@google/genai)](https://github.com/google-gemini/generative-ai-js)
- **Backend & Server**: [Express.js](https://expressjs.com/), [tsx](https://github.com/privatenumber/tsx), [esbuild](https://esbuild.github.io/)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
# Gemini API Key (Server-Side AI Assistant)
GEMINI_API_KEY=your_gemini_api_key

# Hosting URL
APP_URL=http://localhost:3000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com

# Email Alerts (Optional - Resend)
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_email@example.com
EMAIL_FROM=onboarding@resend.dev
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or newer)
- npm, yarn, or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/username/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### 3. Running Locally
```bash
# Start the full-stack dev server (Express + Vite on Port 3000)
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### 4. Building for Production
```bash
# Build frontend assets and bundle CommonJS server
npm run build

# Run the production server
npm start
```

---

## 🔐 Accessing the Admin Panel

1. Click on the **Admin** shield icon in the top navigation bar (or press `Ctrl + Shift + A` / go to the Admin portal).
2. Sign in with your configured admin credentials.
3. Edit your portfolio live! All changes are synced in real-time to Firebase Firestore and immediately reflected on the live site.

---

## ⚡ Performance Optimizations

- **GPU Acceleration**: Uses `transform: translateZ(0)` and optimized composite layers for buttery smooth 120 FPS animations.
- **Zero Re-Render Interactions**: Magnetic hover buttons operate via native motion springs without triggering React component re-renders.
- **RequestAnimationFrame Throttling**: Mouse movements, starfield canvas rendering, and custom cursors run on `requestAnimationFrame` loops to prevent CPU lag.
- **Content Visibility**: Offscreen DOM sections utilize `content-visibility: auto` to minimize paint and layout times during rapid scrolling.

---

## 📄 License & Attribution

Developed by **Leanur Rahman**. Distributed under the **Apache-2.0 License**.
