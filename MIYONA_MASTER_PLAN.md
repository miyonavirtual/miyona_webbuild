# Miyona.ai - Master Project Plan & Vision

## 1. Core Concept & Unique Selling Point (USP)
The primary feature and MVP of Miyona.ai is the **Video Call Experience**. 
Users can join a stylized, face-to-face video call with Miyona (a 3D AI companion). She will appear from the chest up, featuring perfect facial expressions, lip-syncing, and real-time conversation.

## 2. The 3D Environments & Views
Instead of a roaming first-person game, the 3D integration will have three distinct, highly polished views:

### A. The Dashboard View (`/playground`)
- **Setting:** Transparent background in Unity. The Next.js website UI itself serves as the background.
- **Action:** Miyona stands idle while UI elements (stats, memory logs, call button) surround her. 
- **Purpose:** Central hub for the user to interact with the web app and initiate calls.

### B. The Video Call View (`/call`) - THE MVP
- **Setting:** The highly aesthetic Night Temple Environment.
- **Action:** Chest-up framing "Face-to-Face" camera, but the user has the ability to move their camera to look around the environment or at Miyona from different angles.
- **Interaction & Emotion:** Miyona will talk with voice, read user expressions via webcam (vision), speak with her mouth (lip-sync), and perform specific animations and show emotions (e.g., jolly, sad) based on the context of the conversation using VRM facial rigging.
- **Purpose:** Intimate, focused 1-on-1 interaction. High priority on flawless facial animation, LLM integration, and Hindi lip-syncing.

## 3. The AI & Tech Stack
- **Languages:** Hindi speaking is a major priority and core feature.
- **STT/TTS (Speech-to-Text / Text-to-Speech):** Deepgram APIs (chosen for ultra-fast, real-time streaming capabilities and high scalability).
- **LLM (Brain):** Groq API (running models like Llama 3) for near-instant inference, ensuring natural conversational flow without awkward delays.
- **Vision/Multimodal:** Web-based webcam analysis to read the user's facial expressions and send that state to Groq as context for Miyona's reactions.
- **3D Engine:** Unity (exported via WebGL) communicating directly with the Next.js/React web frontend. The frontend parses LLM text specifically looking for emotion tags (e.g., `[jolly]`, `[sad]`) to trigger VRM blendshapes in Unity.

## 4. Website Features & Architecture
- **Call Memory Section:** After a video call ends, the user is presented with a choice to extract insights and facts from the conversation. This data is stored in the "memory section" (a vector database or structured tables) so Miyona remembers details in future interactions.
- **Call History:** A dedicated dashboard page where users can view a history of their past video calls with Miyona, including a generated summary of each individual call's discussion.
- **Tier & Monetization Logic:**
  - **Free Tier:** Strictly rate-limited (e.g., maximum 5 minutes of video call time per day).
  - **Paid Tiers:** Unlocks extended call times, advanced memory retention, etc.
- **Rate Limiters:** Robust backend protection to ensure the Deepgram/Grok APIs are not abused by free users or bots.

## 5. Development Roadmap
1. **Unity Phase 1 (Environments & Cameras):** Set up the Sakura scene, the Room scene, and the 3 distinct camera systems (Chat View, Room View, Call View).
2. **Unity Phase 2 (Facial & Lip Sync):** Implement `uLipSync` or similar OVRLipsync alternatives for VRM to sync audio playback to Miyona's blendshapes.
3. **Web Phase 1 (UI & Integrations):** Build the Video Call UI overlay, the generic chat overlay, and the Call Memory pages.
4. **AI Pipeline Phase:** Wire Deepgram + Grok + standard WebRTC/Audio Context together so the user can speak (Hindi) -> text -> Grok -> text -> Deepgram TTS -> Unity Audio Source -> Lip Sync.
5. **Backend Phase:** Implement the PostgreSQL/Supabase database for users, call logs, Tier checking, and API rate limiting.
