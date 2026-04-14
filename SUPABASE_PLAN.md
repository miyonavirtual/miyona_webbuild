# Supabase Implementation Plan (Miyona.ai)

This document tracks the database architecture for Miyona.ai's UI components, ensuring seamless integration between the Next.js frontend and the Supabase backend.

## 1. Dashboard & Call History (`/chat` & `/call`)

**Component Goal:** Allow users to chat via text (Dashboard) or voice/video (Call), and review past conversations in the Call History.

**Table: `sessions`**
Groups distinct conversations or voice/video calls.
- `id` (uuid, primary key)
- `user_id` (uuid, references `profiles.id`)
- `type` (text - 'chat', 'voice_call', 'video_call')
- `title` (text - e.g., "Late Night Chat")
- `summary` (text - AI recap of the entire conversation)
- `started_at` (timestamptz)
- `ended_at` (timestamptz)
- `created_at` (timestamptz)

*Note: We deliberately decided against storing every single transcribed message line to prevent database bloat. The AI will generate a `summary` at the end of the session.*

## 2. My Miyona Personas (`/mymiyona`)

**Component Goal:** Allow users to select how Miyona acts (Friend, Wife, Girlfriend, etc.) or write custom system prompts. Only "Friend" is unlocked by default.

**Table: `personas` (Global Presets)**
- `id` (uuid, primary key)
- `name` (text - e.g., 'Friend', 'Wife')
- `system_prompt` (text)
- `is_locked` (boolean - default true)

**Table: `user_personas` (User Settings)**
- `id` (uuid, primary key)
- `user_id` (uuid, references `profiles.id`, unique)
- `persona_id` (uuid, nullable, references `personas.id`)
- `custom_prompt` (text - nullable, for overrides)
- `updated_at` (timestamptz)

## 3. Memories & Facts (`/memories`)

**Component Goal:** Store facts and entities the AI learns about the user over time, mapped directly to the UI categories.

**Table: `memories`**
- `id` (uuid, primary key)
- `user_id` (uuid, references `profiles.id`)
- `category` (text - 'family', 'temporary', 'background', 'favorites', 'appearance', 'hopes', 'opinions', 'personality', 'other', 'pinned_replika', 'pinned_user')
- `content` (text - the actual fact, e.g., "User's brother is named Alex")
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## UI Linking Strategy
1. **Chat/Call conclusion:** Call an API route that prompts the Gemini LLM to summarize the interaction. Insert a new row into `sessions`.
2. **Memory Extraction:** During conversations, run a background LLM prompt to identify facts. Insert these facts into the `memories` table under the correct category.
3. **LLM Context Injection:** When initializing a chat/call:
   - Fetch the active `user_personas` (custom prompt or the joined `personas.system_prompt`).
   - Fetch `memories` for the current `user_id` and inject them into the system context so the AI remembers past details.
