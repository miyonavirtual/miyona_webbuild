"use client";

import { useEffect, useState } from "react";
import CallClient from "./CallClient";

export default function CallPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    
    if (!mounted) return <div className="h-screen w-full bg-background flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;
    return <CallClient />;
}
