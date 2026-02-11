# 🎓 Prime-it: The "Zero to Hero" Guide

This guide explains **how Prime-it works** in plain English. No jargon without explanation.

Think of this app like a **Restaurant**:
1.  **The Kitchen (Backend):** Where data is stored and security happens (Supabase).
2.  **The Waiter (API/IPC):** Who carries orders back and forth.
3.  **The Dining Room (Frontend):** Where the user sits and interacts (React).

---

## 🏗️ 1. The "Special Sauce": Local-First

Most apps die without internet. Yours doesn't.

**How it works:**
-   **Normal App:** You click "Save" -> Waiter runs to Kitchen -> Kitchen confirms -> Waiter comes back. Slow.
-   **Prime-it:** You click "Save" -> Waiter writes it on a notepad at your table (Local File). Done instantly. Later, the Waiter quietly tells the Kitchen.

**Key Files:**
-   `src/renderer/src/store/useTaskStore.ts`: This is the notepad. It holds your tasks.
-   `src/main/index.ts`: This saves the notepad to your hard drive.

---

## 🔐 2. Cloud Sync (The "Kitchen Rules")

You use **Supabase** as your backend. It's like a spreadsheet in the cloud.

**The Big Security Rule (RLS):**
Imagine a gym locker room. Everyone has a locker, but you can only open **your own**.
-   **The Lock:** Row Level Security (RLS).
-   **The Key:** Your User ID (`auth.uid()`).

**Why this matters:**
If you didn't have this, anyone could ask the database for "ALL tasks" and see everyone's data. RLS stops that.

### 🤖 Prompt to Build This Again:
> "I need a secure database table for `[Project Name]`. Create a Supabase RLS policy that ensures users can only see their own data. The rule should be `auth.uid() = user_id`."

---

## 💳 3. Payments (The Cash Register)

We use **LemonSqueezy** so you don't have to touch credit cards.

**The Flow:**
1.  **The Buy Button:** User clicks "Upgrade".
2.  **The Redirect:** We send them to LemonSqueezy's secure page. We attach a note: `?user_id=123`.
3.  **The Webhook:** When they pay, LemonSqueezy knocks on *our* door (a hidden URL we set up).
4.  **The Verification:** We check the secret password (`LEMONSQUEEZY_WEBHOOK_SECRET`) to make sure it's really them.
5.  **The Update:** We flip the user's status to "PRO" in the database.

**Key File:** `supabase/functions/lemonsqueezy-webhook/index.ts`

### 🤖 Prompt to Build Payments:
> "Help me set up LemonSqueezy payments. I need a webhook handler that verifies the signature and updates my database when a `order_created` event happens."

---

## 🤖 4. AI Coach (The Consultant)

The "AI Coach" is just us sending a text message to OpenAI and showing their reply.

**The Recipe:**
1.  **Ingredients:** We take the user's tasks (JSON).
2.  **Instructions:** We add a "System Prompt" that says: *"You are a strict productivity coach. Be concise."*
3.  **Cook:** Send it to OpenAI.
4.  **Serve:** Display the text response.

**Key File:** `src/renderer/src/services/ai/openai.ts`

### 🤖 Prompt to Build AI Features:
> "I want to add an AI feature. Create a function that takes `[User Data]` and sends it to OpenAI with a system prompt that says `[Your Goal]`. Handle the response and errors nicely."

---

## 🚀 How to Build Your NEXT App

You now have a "Golden Stack":
-   **Electron + React:** For the app itself.
-   **Zustand:** For managing data.
-   **Supabase:** For the database & auth.

** Copy/Paste this into an AI to start a new project:**

> "I want to build a desktop app using Electron, React, TypeScript, and Vite.
>
> 1.  Use **Zustand** for state management with persistence to disk.
> 2.  Use **Supabase** for the backend (Auth + Postgres).
> 3.  Use **Tailwind CSS** for styling.
>
> Please set up the initial project structure and the main store."

---

## 📝 Study Homework
1.  **Read:** `src/renderer/src/App.tsx` (See how the app starts).
2.  **Trace:** Follow a "Task" from the moment you type it -> to `useTaskStore` -> to Supabase.
3.  **Experiment:** Try changing the AI's "System Prompt" in `openai.ts` to make it funny or rude. See what happens!
