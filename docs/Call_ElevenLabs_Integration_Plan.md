# Call Page: Voice & Intelligence Integration Plan

## Overview
This document outlines the architecture and next steps for finalizing the `/call` page. The goal is to fully integrate voice capabilities and memory persistence so that the 3D immersive call experience matches the intelligence and context of the text-based `/chat` page. Deepgram has been removed, and we will be migrating to ElevenLabs for high-quality TTS and emotional delivery.

## Key Phases for Next Session

### Phase 1: Voice Input (STT)
- Capture user microphone input via native browser `SpeechRecognition` or an alternative STT provider (e.g., Whisper).
- Wait for the user to finish speaking, transcribe the audio, and prepare it as a text payload.

### Phase 2: Intelligence & Memory Persistence
- Send the transcribed text through our existing Groq API (`/api/voice/chat`), passing along the user's Persona strings and previous context.
- Just like the `/chat` page, trigger the background memory extractor (`/api/memories/extract`) so that any facts shared during the voice call are permanently saved to Firestore.

### Phase 3: Emotional Sync & Unity Integration
- Parse the Groq response for behavioral tags/cues (e.g., `*smiles*`, `*laughs*`, `*sad*`).
- Map these tags into valid Unity states and invoke `sendMessage("WebGLBridge", "PlayReaction", currentReaction)`.

### Phase 4: Voice Output (TTS) & Lip Sync
- Send the textual response from Groq directly to the ElevenLabs TTS API.
- Stream the high-fidelity audio buffer back to the browser.
- Trigger `StartSpeaking` to animate Miyona's mouth while the audio plays, and `StopSpeaking` when the audio visually finishes.

## End Result
A fluid, hands-free conversation with Miyona where memory, emotion, and persistent database logic run seamlessly in the background, all utilizing the ultra-clean, full-screen UI we accomplished today.
