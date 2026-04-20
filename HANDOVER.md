# Miyona.ai — Developer Handover

**Project:** AI companion app (branded as Luvoia)  
**Stack:** Next.js 16 / React 19 / TypeScript / Firebase / Three.js / Groq / ElevenLabs  
**Last updated:** April 20, 2026  
**Git branch:** `main`

---

## What This App Does

A real-time AI companion with a 3D character named **Luvoia**. Users can:
- Text chat with the character (rendered via Three.js VRM)
- Voice call the character (rendered via Unity WebGL)
- Customize the AI persona and relationship type
- Browse/edit extracted memories from past conversations
- Earn coins through active call time

---

## Start Here

### Run the app
```bash
npm run dev     # localhost:3000, webpack bundler
npm run build   # production build
```

### Critical env vars (copy from `.env.example`)
```
GROQ_API_KEY
ELEVENLABS_API_KEY
DEEPGRAM_API_KEY
DEEPGRAM_PROJECT_ID
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Read these 7 files first — they control everything
| File | Why |
|------|-----|
| `src/app/layout.tsx` | Root providers, metadata |
| `src/app/globals.css` | Theme (OKLCH colors), animations |
| `src/lib/firebase/client.ts` | Firebase/auth init |
| `src/app/api/voice/chat/route.ts` | Core LLM logic (persona + memory) |
| `src/app/(app)/chat/ChatClient.tsx` | VRM + Three.js + lip-sync |
| `src/app/(app)/call/CallClient.tsx` | Voice pipeline + Unity WebGL |
| `src/components/NavBar.tsx` | Auth state, wallet, navigation |

---

## Folder Map

```
miyona.ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout (ThemeProvider, Toaster)
│   │   ├── globals.css                  # Tailwind v4 + custom theme vars
│   │   ├── (marketing)/                 # Public pages (no auth)
│   │   │   ├── page.tsx                 # Landing: Hero + Features + FAQ
│   │   │   └── pricing/page.tsx         # Pricing table
│   │   ├── (auth)/                      # Auth flow
│   │   │   ├── login/page.tsx           # Google OAuth popup
│   │   │   └── username/page.tsx        # Post-login username setup
│   │   ├── (app)/                       # Protected pages (require Firebase auth)
│   │   │   ├── chat/
│   │   │   │   ├── page.tsx             # Server component shell
│   │   │   │   └── ChatClient.tsx       # TEXT chat + Three.js VRM model
│   │   │   ├── call/
│   │   │   │   ├── page.tsx             # Server component shell
│   │   │   │   └── CallClient.tsx       # VOICE call + Unity WebGL
│   │   │   ├── mymiyona/page.tsx        # AI persona customization
│   │   │   └── memories/page.tsx        # View/edit extracted memories
│   │   └── api/
│   │       ├── voice/
│   │       │   ├── chat/route.ts        # POST: text → Groq LLM → JSON response
│   │       │   ├── tts/route.ts         # POST: text → ElevenLabs audio stream
│   │       │   └── route.ts             # DEPRECATED unified endpoint
│   │       ├── deepgram/
│   │       │   └── get-token/route.ts   # GET: temp Deepgram WebSocket key
│   │       ├── memories/
│   │       │   └── extract/route.ts     # POST: Groq extracts facts from exchange
│   │       └── auth/
│   │           └── callback/route.ts    # PLACEHOLDER — not implemented
│   ├── components/
│   │   ├── ui/                          # shadcn/ui primitives (button, input, etc.)
│   │   ├── landing/                     # Landing page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx               # PUBLIC navbar (landing only)
│   │   │   ├── Features.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── Footer.tsx
│   │   ├── NavBar.tsx                   # APP navbar (authenticated pages)
│   │   ├── SettingsModal.tsx            # Theme, font, account settings
│   │   ├── WalletModal.tsx              # Gem/coin purchase UI (mock, no payment)
│   │   ├── ProUpgradeCard.tsx           # Subscription upsell
│   │   ├── ThemeProvider.tsx            # next-themes wrapper
│   │   └── TextSettingsProvider.tsx     # Font size/style context
│   ├── hooks/
│   │   └── useDeepgramVoice.ts          # Deepgram WebSocket hook (unused in main flow)
│   └── lib/
│       ├── firebase/client.ts           # Firebase app + auth + Firestore init
│       └── utils.ts                     # cn() helper for Tailwind class merging
├── public/
│   ├── MiyonaWebBuild_CallOne/          # Unity WebGL build (used in /call)
│   │   ├── Build/                       # Compiled Unity assets
│   │   └── TemplateData/
│   ├── MiyonaWebBuild_Call/             # Legacy/backup Unity build
│   └── models/                          # VRM character model files (.vrm)
├── middleware.ts                         # Next.js middleware (auth disabled, transitioning)
├── next.config.ts                        # Webpack forced, strict mode off, build errors ignored
├── postcss.config.mjs                    # Tailwind CSS v4 PostCSS config
├── firestore.rules                       # Firebase security rules
└── download-lfs.js                       # Script to pull Git LFS files (VRM + Unity builds)
```

---

## Routes

### Public
| Route | File | Notes |
|-------|------|-------|
| `/` | `(marketing)/page.tsx` | Landing page |
| `/pricing` | `(marketing)/pricing/page.tsx` | Static pricing |

### Auth
| Route | File | Notes |
|-------|------|-------|
| `/login` | `(auth)/login/page.tsx` | Google OAuth popup |
| `/username` | `(auth)/username/page.tsx` | Sets `displayName` in Firebase |

### Protected (Firebase auth required)
| Route | File | Notes |
|-------|------|-------|
| `/chat` | `(app)/chat/ChatClient.tsx` | Text chat + Three.js VRM |
| `/call` | `(app)/call/CallClient.tsx` | Voice call + Unity WebGL |
| `/mymiyona` | `(app)/mymiyona/page.tsx` | Persona customization |
| `/memories` | `(app)/memories/page.tsx` | Memory browser/editor |

---

## Firestore Schema

```
users/{uid}/
  messages/{docId}
    role: "user" | "miyona"
    text: string
    timestamp: serverTimestamp()

  memories/{docId}
    category: "user_name" | "preferences" | "background" | "hopes" | "other"
    text: string
    timestamp: serverTimestamp()

  settings/
    persona/
      text: string   ← full system prompt override for AI character

  wallet/
    balances/
      gems: number   ← premium currency (init: 17)
      coins: number  ← soft currency (init: 2000, +100 per 3min active call)
```

---

## Core Data Flows

### Text Chat (`/chat`)
```
User types → handleSend()
  → POST /api/voice/chat    (text + last 10 messages + all memories + persona)
  → Groq llama-3.3-70b      response JSON: { response, reaction }
  → POST /api/voice/tts     (response text)
  → ElevenLabs audio stream  plays in browser
  → VRM mouth animations    (lip-sync while audio plays)
  → POST /api/memories/extract  (background, saves facts to Firestore)
```

### Voice Call (`/call`)
```
Browser Web Speech API → transcript text
  → same chat + TTS pipeline as above
  → reaction tag → simulated keyboard event → Unity WebGL animation
  → ElevenLabs audio plays + live captions shown
  → timer: +100 coins every 3 min unmuted → Firestore wallet
```

### Memory Loop
```
Every exchange → /api/memories/extract
  → Groq extracts permanent facts (name, preferences, background, etc.)
  → saved to Firestore memories collection
  → injected into next conversation context
```

---

## Animation System

### Chat page — Three.js VRM
- Idle: blinking, arm sway, breathing (bone animations)
- Lip-sync: mouth expressions (`aa`, `ou`) mapped to audio playback duration
- Look-at: VRM head tracks camera position
- Loaded from: `public/models/*.vrm`

### Call page — Unity WebGL
| Reaction tag from API | Unity function call |
|----------------------|-------------------|
| wave, hello | `PlayReaction("wave")` |
| kiss | `PlayReaction("kiss")` |
| excited, clapping | `PlayReaction("excited")` |
| shy, bashful | `PlayReaction("shy")` |
| thinking, hmm | `PlayReaction("thinking")` |
| sigh | `PlayReaction("sigh")` |
| angry, mad | `PlayReaction("angry")` |
| sad, sorrow, cry | `PlayReaction("sad")` |
| smile, happy, joy | `ReceiveEmotion("happy")` |
| relax, calm | `ReceiveEmotion("relaxed")` |
| surprised, shock | `PlayReaction("surprised")` |
| (default) | `ReceiveEmotion("neutral")` |

Unity build is invoked via `react-unity-webgl` and keyboard event simulation.

---

## Theme System

Colors use OKLCH in `globals.css`:
- Background: near-black + purple hint `oklch(0.05 0.01 290)`
- Primary: neon purple `oklch(0.65 0.25 300)` — buttons, chat bubbles
- Glass effect: `.bg-glass` — black/40 + blur + white/5 border
- Animated background: `.bg-cosmic-animation`

Fonts: **Playfair Display** (headings) + **Lato** (body). User can change size/style via `TextSettingsProvider`.

---

## Persona System (`/mymiyona`)

Default persona loaded if none saved:
> "Luvoia is a 28-year-old pottery artist from LA..."

Custom text saved to: `users/{uid}/settings/persona`

Relationship roles: **Friend** (free), **Girlfriend / Wife / Sister / Mentor** (Pro-locked, UI only — no payment backend).

---

## What's Not Done Yet

| Feature | Status | Notes |
|---------|--------|-------|
| Payment / Pro subscription | Mock only | `WalletModal.tsx` has UI, no Stripe/payment wired |
| Call history tab | UI ready | No backend data source |
| Onboarding flow | Route exists | `(auth)/onboarding/` is empty |
| Auth callback | Placeholder | `/api/auth/callback/route.ts` does nothing |
| Deepgram voice | Fully built | `useDeepgramVoice.ts` + `/api/deepgram/get-token` — not used in main flow (Web Speech API used instead) |
| Auth middleware | Disabled | `middleware.ts` is commented out — no server-side route protection |
| Pro feature gates | UI only | Role locks are frontend conditionals, no backend enforcement |

---

## Known Gotchas

- **React Compiler disabled** — caused startup hangs, left off in `next.config.ts`
- **Build errors ignored** — `ignoreBuildErrors: true` set; TypeScript errors won't fail CI
- **`--webpack` flag required** — Turbopack caused compilation failures; dev server uses webpack
- **backdrop-blur breaks WebGL** — don't add `backdrop-filter: blur()` to full-width elements on mobile; it kills the Three.js canvas on iOS Safari. Use solid colors instead (e.g. `bg-zinc-950`)
- **VRM + Unity builds are Git LFS** — run `node download-lfs.js` after cloning if models are missing
- **ElevenLabs voice ID is hardcoded** — `EXAVITQu4vr4xnSDxMaL` in `/api/voice/tts/route.ts`

---

## Where to Continue

**If adding payments:** Wire Stripe into `WalletModal.tsx`, create `/api/payments/` routes, gate Pro features server-side.

**If replacing Web Speech API:** `useDeepgramVoice.ts` is ready — swap into `CallClient.tsx`.

**If improving memory:** The extraction prompt is in `/api/memories/extract/route.ts`. Add deduplication and a memory relevance score.

**If adding more VRM animations:** Extend the idle/reaction system in `ChatClient.tsx` — bone names and expression keys are loaded dynamically from the VRM file.

**If enabling server-side auth protection:** Uncomment and implement `middleware.ts`.
