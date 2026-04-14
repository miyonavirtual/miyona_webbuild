"use client";

import { useState, useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/ThemeProvider"; // Wait, user auth is actually from a specific hook. Let me check chat/page.tsx
