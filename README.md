<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/rocket.svg" alt="PrepPath Logo" width="80" height="80" />
  <h1 align="center">PrepPath</h1>
  <p align="center">
    <strong>AI-Powered Course Generation Platform</strong>
    <br />
    Learn anything. Your way.
  </p>
  <p align="center">
    <a href="#live-demo">Live Demo</a> ·
    <a href="#features">Features</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#getting-started">Getting Started</a> ·
    <a href="#project-structure">Project Structure</a>
  </p>
</div>

<hr />

## � Live Demo

**Check out the live application here:**
[**https://prep-path-gfxslfq30-ashupanchal8360-6347s-projects.vercel.app/**](https://www.prep-pathlearning.me/)

Explore the community courses, sign up for a free account, and generate your very own AI-curated learning path in seconds. 

---

## �🌟 Overview

**PrepPath** is an intelligent, highly-scalable, AI-driven educational platform designed to completely automate the creation of structured learning paths. Built on top of the robust Next.js 16 App Router and powered by Google Gemini (with seamless Groq fallbacks for high availability), PrepPath allows learners to type literally any topic—from "System Design Fundamentals" to "TypeScript Generics" to "The History of Rome"—and instantly generate a deep, multi-chapter curriculum tailored exactly to their selected difficulty level.

The core philosophy behind PrepPath is to say goodbye to generic, one-size-fits-all tutorials. Traditional online courses are static; if you already understand a concept, you are forced to skip through it. PrepPath understands context, skips what you already know based on your chosen difficulty level, and dynamically generates textbook-grade markdown/HTML content natively paired with highly relevant YouTube videos. 

Whether you are a student cramming for an exam, a software engineer looking to pick up a new framework over the weekend, or an educator designing a syllabus, PrepPath generates a beautifully formatted, trackable, and comprehensive course in under 30 seconds.

---

## ✨ Features In Detail

### 🧠 Instant AI Curriculum Generation
Enter a topic, choose a level (`Beginner`, `Intermediate`, or `Advanced`), and watch as AI architecturally splits the subject into logical modules and chapters. The backend crafts a highly specific system prompt enforcing a strict JSON output. This ensures that the generated syllabus is consistently formatted, logically sequenced, and appropriately scoped to the user's current knowledge level.

### ⚡ Dynamic Content Streaming via NDJSON
One of the biggest hurdles with serverless AI applications (especially on platforms like Vercel with strict 10-15 second timeout limits) is waiting for the LLM to generate massive blocks of text. PrepPath bypasses this entirely using **Newline Delimited JSON (NDJSON)** streaming over HTTP. Instead of waiting for a 10,000-word course to finish generating, PrepPath streams the completion status of each chapter *as it finishes* directly back to the client interface, providing real-time, granular progress updates without dropping the HTTP connection.

### 🛡️ Smart Multi-Key Fallback System
Defined in a custom `ai-provider`, PrepPath guarantees 99.9% uptime for generations. It accepts an array of Google Gemini API keys. It tracks the usage and rate-limit hits for each key locally. If Key A throws a `429 Too Many Requests`, the pointer aggressively shifts to Key B seamlessly mid-generation. Furthermore, if all Gemini keys are temporarily exhausted, the provider abandons Google and reroutes the identical prompt to the **Groq API** (running LLaMA-3-70b), ensuring the user never sees a failure screen.

### 🎬 Contextual YouTube Integration
A course isn't just text. During the generation phase, PrepPath parses the AI-generated topics for each chapter and fires off parallel requests to the YouTube Data API. It intelligently filters out "Shorts" and overly long content, embedding the highest-quality, most relevant educational video directly into the study page alongside the generated textbook reading.

### 🔒 Idempotency & Resiliency
Data integrity is paramount. User management relies on Clerk Webhooks. To prevent malicious database insertions or duplicate errors during webhook retries, the Next.js backend enforces `svix` cryptographic signature validation. Database operations strictly adhere to `.onConflictDoUpdate()` patterns, ensuring that rapid clicks or network stutters don't result in dirty database writes.

### 📊 Real-Time Progress Tracking & Caching
PrepPath features visual roadmaps and progress bars that calculate completed modules against total modules. When a user marks a chapter as "Completed", an upsert hits the Neon PostgreSQL database, and the Next.js `revalidatePath` cache is immediately purged. This guarantees that the user's dashboard and sidebar instantly reflect their new progress state without requiring a hard browser refresh.

### 🎨 Stunning UI/UX & Animations
Crafted predominantly with Tailwind CSS v4, the interface feels premium and futuristic. It heavily utilizes `framer-motion` for buttery-smooth page transitions, staggering hero typographies, and complex mouse-tracking spotlight effects on course cards. The landing page features a robust sticky-scroll mechanic that visually navigates the user through the "How it Works" steps.

### 🔐 Secure Authentication & Library Management
Drop-in identity verification, session management, and robust webhook synchronization are provided by Clerk. Users have their own "My Courses" library. If a user discovers a course generated by the community on the "Explore" page, they can clone it to their personal library with a single click, instantly tracking their own isolated progress on another creator's syllabus.

---

## 🛠 Tech Stack

PrepPath leverages the modern bleeding-edge ecosystem of the React/TypeScript environment to ensure type safety from the database layer all the way to the frontend components:

### Core Frame & UI
- **Framework:** Next.js 16.1.6 (App Router) - Leveraging Server Components for direct database querying and Client Components for rich interactivity.
- **Library:** React 19.2.3 & ReactDOM 19.2.3
- **Styling:** Tailwind CSS v4 - Utilizing utility-first styling with custom CSS variables for easy dark-mode theming.
- **Component Libraries:** 
  - Shadcn UI (Accessible, customizable Radix primitives)
  - Radix UI
  - Base UI
- **Animation Engine:** 
  - Framer Motion 12.34.3 (For layout animations, gestures, and scrolling effects)
  - GSAP 3.14.2

### Database & Backend
- **Database:** Neon Serverless PostgreSQL (`@neondatabase/serverless`) - Providing incredibly fast connection pooling optimal for Next.js serverless functions.
- **ORM:** Drizzle ORM 0.45.1 - Offering maximum type safety and raw SQL-like performance.
- **Auth:** Clerk (`@clerk/nextjs`) - Handling JWTs, session tokens, and OAuth providers.
- **Webhooks:** Svix - Guaranteeing the authenticity of Clerk payloads.

### AI & External APIs
- **Primary LLM:** Google Gemini (`@google/genai`) - Specifically `gemini-2.5-flash` for blazing fast structured JSON generation.
- **Fallback LLM:** LLaMA-3 via Groq (`groq-sdk`) - Specifically `llama-3.3-70b-versatile`.
- **Media Assets:** 
  - Unsplash API - Fetching dynamic, high-res cover photography based on course categories.
- **Video:** YouTube Search API - For contextual lecture embedding.

---

## 🏗 Architecture & Core Workflows

PrepPath relies on heavily optimized asynchronous workflows. Here is how the core systems interact under the hood:

### 1. The Generation Pipeline (Streaming Architecture)
Instead of forcing the user to wait 30-40 seconds for an LLM to generate an entire course textbook (which would undoubtedly trigger a serverless `504 Gateway Timeout`), PrepPath utilizes a **batch-streaming hybrid approach** via Server-Sent Events (NDJSON).
1. The user requests a layout via `POST /api/generate-course-layout`. Pure, lightweight JSON is returned outlining the syllabus. The user is redirected to the editor.
2. The user initiates content generation via `POST /api/generate-course-content`. 
3. The server bundles all un-generated chapters together and prompts the LLM to separate them with custom delimiter tokens.
4. As the LLM streams the response back, the server decodes it chunk by chunk. Every time a chapter delimiter is reached, the server pauses the stream loop, fires off a request to the YouTube API, writes the finished HTML chapter to the Neon Database, and flushes an NDJSON progress event back to the client (`{ type: "progress", chapter: 2 }`). 
5. The `ReadableStreamDefaultReader` on the frontend updates the UI dynamically, letting the user know exactly which chapter is currently being written.

### 2. High-Availability Provider Mapping
Defined in `src/config/ai-provider.ts`, PrepPath abstracts the concept of an "AI Model" away from the application logic. 
- The module parses a comma-separated list of keys from `GEMINI_API_KEY`.
- It attempts the generation. If it catches an error, it inspects the HTTP status code.
- If it's a `429`, it marks the current key as exhausted and recursively calls itself with the next key in the array.
- If the array is exhausted, it formats the prompt to match Groq's chat completion schema and seamlessly delegates the task to LLaMA-3. The frontend is completely unaware of this failover.

### 3. Headless User Synchronization
User data (Email, Avatar, Name) must exist in our PostgreSQL database to establish foreign-key relationships with generated courses. However, users sign up via Clerk's hosted UI.
- When a user registers, Clerk fires a webhook to our Next.js backend (`/api/webhooks/clerk`). 
- We use the `svix` library to verify the `svix-id`, `svix-timestamp`, and `svix-signature` headers against our `CLERK_WEBHOOK_SECRET`.
- If valid, we extract the user data and perform a headless `INSERT INTO usersTable ... ON CONFLICT DO NOTHING`. This guarantees sync without slowing down the user's initial login redirect.

---

## 📂 Project Structure

A brief look into how the repository is architected:

```text
├── drizzle/                      # Auto-generated SQL migrations from Drizzle Kit
├── src/
│   ├── app/                      # Next.js 16 App Router Root Directories
│   │   ├── (auth)/               # Clerk Authentication Pages (sign-in, sign-up)
│   │   ├── (home)/               # Public-facing Landing Pages (Blog, Pricing)
│   │   ├── api/                  # Serverless API Endpoints (Generating, Syncing, Fetching)
│   │   │   ├── all-courses/      # Public library search pagination
│   │   │   ├── generate-course*/ # The core NDJSON streaming and layout generation APIs
│   │   │   ├── webhooks/         # Svix verified Clerk webhooks
│   │   │   └── ...
│   │   └── workspace/            # Authenticated User Dashboard
│   │       ├── edit-course/      # Course layout preview and generation trigger
│   │       ├── explore/          # Community library searching
│   │       ├── my-courses/       # The user's personal enrolled library
│   │       └── study/            # The main study interface & video player
│   ├── components/               # Shared React Components
│   │   ├── home/                 # Heavy Framer Motion components specific to the landing page
│   │   └── ui/                   # Reusable Shadcn primitives (Buttons, Inputs, Dialogs)
│   ├── config/                   # Core Infrastructure Setup 
│   │   ├── schema.ts             # Drizzle ORM Table Definitions
│   │   ├── db.tsx                # Neon Serverless Postgres Connection
│   │   └── ai-provider.ts        # Fault-tolerant AI routing logic
│   ├── hooks/                    # Reusable React Hooks (e.g., use-mobile)
│   ├── context/                  # Global React Contexts
│   └── lib/                      # Helper libraries, constants, and utilities (cn merge)
├── .env.example                  # Example Environment variables template
├── drizzle.config.ts             # Drizzle Kit Configuration specifying schema location
├── components.json               # Shadcn-UI component specification
└── tailwind.config.ts            # Tailwind styling configs & plugin injection
```

---

## � Database Schema Details (Drizzle ORM)

PrepPath uses a clean, normalized relational model optimized for rapid querying and upserting:

- **`usersTable`**: Core identities synced headlessly from Clerk webhooks. Has columns for `name`, `email` (primary identifier), and `subscriptionId`.
- **`coursesTable`**: Metadata for the generated layout. Contains the UUID `cid`, raw `courseJson` from the AI, categories, difficulty, boolean flags, and the Unsplash `bannerImage`.
- **`chaptersContentTable`**: The heavy lifter. Maps to a specific `courseCid` and `chapterId`. Stores massive strings of generated markdown/HTML (`content`) and the localized `videoId`.
- **`enrollmentsTable`**: A many-to-many junction table explicitly mapping a `userEmail` to a `courseCid`. This allows an unlimited number of users to "clone" or adopt courses they did not generate themselves into their personal library.
- **`chapterProgressTable`**: Tracks granular user completion. Maps a `userEmail` and `courseCid` to a specific `chapterId` alongside a boolean `isCompleted` flag.

---

## 🚀 Getting Started

Follow these detailed steps to run the PrepPath ecosystem locally on your machine.

### Prerequisites
- Node.js (v18.x or later)
- npm or yarn or pnpm
- A free Neon PostgreSQL Database URL
- API keys for Google Gemini, Groq, Clerk, and Unsplash.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/PrepPath.git
cd PrepPath
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables setup
Create a `.env` file in the root directory. You can copy the structure from `.env.example` if it exists, or manually create it based on the following template:

```env
# --- DATABASE (NEON Postgres) ---
DATABASE_URL="postgres://user:password@endpoint.neon.tech/dbname?sslmode=require"

# --- AUTHENTICATION (CLERK) ---
# Get these from your Clerk Dashboard -> API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
# Get this from Clerk Dashboard -> Webhooks -> Add Endpoint -> Signing Secret
CLERK_WEBHOOK_SECRET="whsec_..."

# --- AI PROVIDERS ---
# Note: GEMINI_API_KEY can be a comma-separated list of keys for auto-rotation
# e.g., "AIzaSyA...,AIzaSyB...,AIzaSyC..."
GEMINI_API_KEY="AIzaSyA..."
NEXT_PUBLIC_GEMINI_API_KEY="AIzaSyA..."
GROQ_API_KEY="gsk_..."

# --- MEDIA APIS ---
# Get this from the Unsplash Developer Portal
UNSPLASH_ACCESS_KEY="your_unsplash_key"

# --- OPTIONAL OVERRIDES ---
# GEMINI_CONTENT_MODEL="gemini-2.5-flash"
# GROQ_MODEL="llama-3.3-70b-versatile"
```

### 4. Push the Database Schema
Before running the app, you need to instantiate the tables in your Neon database. Drizzle Kit will read `src/config/schema.ts` and push the necessary SQL commands directly.

```bash
npx drizzle-kit push
```

### 5. Start the Development Server
Fire up the Next.js development server.

```bash
npm run dev
# or
yarn dev
```

Navigate to `http://localhost:3000` in your browser to view the application.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

Whether it's adding support for a new AI provider (like OpenAI or Anthropic), building out the upcoming PDF summarization tools (`/workspace/ai-tools`), or optimizing the streaming chunk sizes, we'd love your help.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Ashu Panchal.
</p>
