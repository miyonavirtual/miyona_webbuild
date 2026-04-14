"use client";

import { createContext, useContext, useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large";
type FontStyle = "sans" | "serif" | "mono";

interface TextSettingsContextType {
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    fontStyle: FontStyle;
    setFontStyle: (style: FontStyle) => void;
}

const TextSettingsContext = createContext<TextSettingsContextType | undefined>(undefined);

export function TextSettingsProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSize] = useState<FontSize>("medium");
    const [fontStyle, setFontStyle] = useState<FontStyle>("sans");

    useEffect(() => {
        const savedSize = localStorage.getItem("miyona-font-size") as FontSize;
        const savedStyle = localStorage.getItem("miyona-font-style") as FontStyle;
        if (savedSize) setFontSize(savedSize);
        if (savedStyle) setFontStyle(savedStyle);
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        // Remove old classes
        root.classList.remove("text-size-small", "text-size-medium", "text-size-large");
        root.classList.remove("font-style-sans", "font-style-serif", "font-style-mono");

        // Add new classes
        root.classList.add(`text-size-${fontSize}`);
        root.classList.add(`font-style-${fontStyle}`);

        localStorage.setItem("miyona-font-size", fontSize);
        localStorage.setItem("miyona-font-style", fontStyle);
    }, [fontSize, fontStyle]);

    return (
        <TextSettingsContext.Provider value={{ fontSize, setFontSize, fontStyle, setFontStyle }}>
            {children}
        </TextSettingsContext.Provider>
    );
}

export function useTextSettings() {
    const context = useContext(TextSettingsContext);
    if (!context) {
        throw new Error("useTextSettings must be used within a TextSettingsProvider");
    }
    return context;
}
