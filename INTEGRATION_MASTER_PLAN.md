# 🧠 Miyona AI: Master Integration Tracker & Architecture Guide

**Purpose:** This document serves as the absolute single source of truth for the AI assistant and developer working on Miyona.ai. Before starting any new task, **read this document** to understand how the entire system connects together.

---

## 🏗️ 1. The Core Architecture (The Flow)

The system works by connecting four major pillars in real-time during a conversation (Voice/Chat):

```
[ User UI ] <---> [ Next.js Server ] <---> [ Gemini AI ] <---> [ Supabase DB ]
     ↑                                                             |
     |--------- (WebGL Bridge / JSON) -----------> [ Unity 3D Engine ]
```

### The Communication Loop (Video Call Example):
1. **User Speaks:** Speech-to-Text captures audio into transcription string.
2. **Context Setup:** Next.js fetches the active `Persona` (from `user_personas` + `personas`) and relevant facts from the `memories` table to build the LLM's system prompt.
3. **LLM processes:** Gemini receives the text and generates an intelligent text reply, along with specific string metadata (e.g., emotional state like "joy" or "sorrow" + selected animation trigger).
4. **TTS Conversion:** The text reply is fed into Text-to-Speech (TTS), returning an audio stream ( হিন্দি / Hindi supported ).
5. **Unity 3D Rendering (WebGL Bridge):**
   - React sends a JSON string via `SendMessage("WebGLBridge", "ReceiveEmotion", "joy")` to the Unity WebGL Canvas.
   - The Unity script `MiyonaEmotionController.cs` interpolates the correct VRM Blendshapes.
   - The TTS Audio plays while real-time lip-sync (`uLipSync` or similar) matches mouth movements.
6. **Session Logging:** After the call ends, Gemini writes a concise summary of the conversation and stores it in the `sessions` table for Call History. New user facts are extracted and appended to the `memories` table.

---

## 🎨 2. UI Routing & Environment Mapping

The Unity project is built as a WebGL export to run seamlessly in the browser. 
It uses a 3-View Architecture based on the Next.js routes:

- **`/playground` (The Dashboard):**
  - **Environment:** Transparent WebGL canvas.
  - **Miyona State:** Idle.
  - **UI Layer:** Sleek dashboard, text chat (`/chat`), relationships stats, My Miyona settings, overlaid seamlessly over her idle animation.
  
- **`/call` (Video Call):**
  - **Environment:** Enclosed Night Temple (Aesthetic Japanese Garden).
  - **Miyona State:** Engaging. Eye contact scripts active, emotion controllers active, and full torso/head tracking.
  - **UI Layer:** Minimalist video call controls (Mute, Hang Up, Switch Camera).

---

## 🗄️ 3. Database Layer (Supabase)
See `SUPABASE_PLAN.md` for full definitions.

**Key Entities:**
1. **`sessions`:** Only stores the high-level `title` and AI-generated `summary` of complete calls (keeps the database lightweight!).
2. **`personas` & `user_personas`:** Stores the selected Persona (Friend, GF, Wife) and custom overrides overriding standard system rules.
3. **`memories`:** Facts extracted *about the user* (e.g., family data, likes/dislikes) to inject back into the Gemini prompt dynamically during future sessions.

---

## 🚀 4. The Checklist: How to Approach Any Task on Miyona

When picking up a new task or feature, the AI should always cross-reference this list:

1. **Which layer am I touching?** (UI, DB, Unity C#, or Next.js API/AI layer)
2. **Is there a schema change?** If yes, update `implementation_plan.md` -> get review -> run `mcp_supabase_apply_migration`.
3. **Is there a Unity script change?** *Remember:* The Unity Editor is structurally separate from the React Web repo! Unity scripts (`UnityAssets/Scripts/`) must be placed carefully, often rewritten for the newer `UniVRM10` API, and then manually copied/hooked up by the user in the Unity Editor.
4. **Does this affect the AI Prompt?** Ensure any new facts/settings map to the `user_personas` or `memories` table so context is retained.

---

**Last Updated:** Phase 1 Setup (DB Architecture & 3D WebGL Bridge Foundations Built).
