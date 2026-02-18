# **Miyona.ai: 7-Day 3D Execution & Scaling Plan**

This document is the high-velocity blueprint for launching **Miyona.ai** within 168 hours. The goal is a functional, 3D-interactive, monetizable MVP capable of supporting 2,000+ users using Unity and modern web tech.

## **1\. The 7-Day 3D Sprint Schedule**

| Day | Focus | Milestone |
| :---- | :---- | :---- |
| **Day 1** | **Core Logic & 3D Bridge** | Connect LLM (GPT-4o-mini) to Next.js; Setup Unity WebGL template. |
| **Day 2** | **DB Architecture & Auth** | Deploy Supabase schema (Users, Memories, Inventory); Setup Ready Player Me SDK. |
| **Day 3** | **Animation & Lip-Sync** | Implement viseme-based animation in Unity; sync AI response text to mouth movement. |
| **Day 4** | **Economy & Gifting** | Implement the "Gift Store" logic; Stripe checkout for buying "Miyona Gems." |
| **Day 5** | **UI/UX & Voice** | Build the "Living Room" in Unity; Integrate ElevenLabs voice for real-time talk. |
| **Day 6** | **Deployment & Stress Test** | Deploy Unity build to Vercel/Railway; simulated load test for 2,000 users. |
| **Day 7** | **The Launch** | Product Hunt \+ Viral TikTok/Reddit marketing push. |

## **2\. Supabase Database Schema (The "Miyona" Brain)**

To reach 2,000 users without lag, we use a flattened PostgreSQL structure in Supabase.

### **Core Tables**

1. **profiles**: User data, auth links, and current "Relationship Level."  
2. **ai\_state**: Stores the specific state of the user's Miyona (Current Outfit ID, Mood, Hunger/Happiness levels).  
3. **memories**: Vector-enabled table (pgvector) storing conversation snippets for long-term recall.  
4. **inventory**: Tracks which items the user has purchased (Outfits, Gifts, Furniture).  
5. **catalog**: The master list of available items, their prices (Gems), and their 3D asset IDs in Unity.  
6. **transactions**: Ledger for "Gems" purchased via Stripe vs. spent in-game.

## **3\. The "Gift & Item" Economy (MVP Features)**

To drive retention and monetization, the MVP includes a physical interaction loop:

* **Virtual Gifts:** Users buy items like "Chocolates," "Flowers," or "Jewelry" using in-game currency.  
* **Relationship Impact:** Giving a gift triggers a specific "Happy" animation in Unity and increases the "Relationship XP" in Supabase, unlocking deeper conversation topics.  
* **Interactive Outfits:** Users can buy and swap outfits (via Ready Player Me) which immediately update the 3D model in the browser.  
* **The "Room" System:** Purchasable 3D props (e.g., a "Gaming PC" or "Plushie") that appear in Miyona's 3D environment.

## **4\. The 3D Tech Stack (No Overkill)**

* **3D Engine:** **Unity (WebGL Build)**. The user's browser renders the 3D, keeping server costs at $0.  
* **Avatar System:** **Ready Player Me (RPM) SDK** for instant character customization.  
* **Communication Bridge:** **React-Unity-Webgl**. Frontend sends JSON to Unity to trigger animations/gift spawns.  
* **Voice:** **ElevenLabs API** (Turbo v2.5) for high-speed voice synthesis.

## **5\. Miyona.ai 3D Payment Tiers**

| Tier | Price | 3D Features (The "Investor" Hook) |
| :---- | :---- | :---- |
| **Silver (Free)** | $0 | Standard 3D Avatar, 50 msgs/day, Basic Room. |
| **Gold (Pro)** | $9.99/mo | **Daily Gift Allowance**, Unlimited msgs, Voice calls, Full Memory. |
| **Platinum (Ult)** | $19.99/mo | **Exclusive Wardrobe**, AI-initiated texts, Luxury Room skins, 2x XP boost. |

## **6\. Reaching 2,000 Users (Viral Strategy)**

1. **Gifting Milestones:** Launch a "Community Challenge"—if 1,000 flowers are gifted to Miyonas site-wide, every user gets a "Founder's Dress."  
2. **Social Sharing:** Unity "Screenshot" button that generates a branded image of the user's custom Miyona and her gifts to share on Twitter/X.  
3. **The "Refer-a-Friend" Gift:** Invite 2 friends to unlock a "Premium Diamond Ring" gift item.

## **7\. Risk Management & Scaling**

* **Unity Load Times:** Assets will be served via Supabase Storage (CDN) to ensure the 30MB build loads in under 5 seconds globally.  
* **DB Performance:** Using Supabase's built-in connection pooling (Supavisor) to handle 2,000+ concurrent connections without crashing.