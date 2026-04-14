"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { auth, signOut } from "@/lib/firebase/client"; // REPLACED: Supabase client
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Moon, Sun, Type, ALargeSmall } from "lucide-react";
import { useTheme } from "next-themes";
import { useTextSettings } from "@/components/TextSettingsProvider";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProfileUpdate: () => void;
}

export function SettingsModal({ isOpen, onClose, onProfileUpdate }: SettingsModalProps) {
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { fontSize, setFontSize, fontStyle, setFontStyle } = useTextSettings();

    useEffect(() => {
        if (isOpen) {
            loadProfileData();
        }
    }, [isOpen]);

    const loadProfileData = async () => {
        const user = auth.currentUser;
        if (user) {
            setEmail(user.email || "");
            setUsername(user.displayName || "");
            // temporarily leaving full_name empty since we ripped out DB queries
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Not authenticated");

            // Update email via auth if changed (Requires Firebase auth updateEmail which we skip for now for simplicity)
            setSuccess("Profile updated successfully (Mock due to migration).");

            onProfileUpdate();
        } catch (err: any) {
            setError(err.message || "An error occurred.");
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const handleDeleteAccount = async () => {
        // In a real app this often requires a server-side action with admin keys.
        // For now, we will sign them out and let them know.
        setError("To fully permanently delete your account, please contact support. You will now be signed out.");
        setTimeout(() => {
            handleLogout();
        }, 3000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-background/95 border-border text-foreground backdrop-blur-xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl font-light">Settings</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Manage your account details and preferences.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Username</label>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-black/5 dark:bg-white/5 border-border focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Display Name</label>
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="bg-black/5 dark:bg-white/5 border-border focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Email Address</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-black/5 dark:bg-white/5 border-border focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2 flex flex-col pt-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Appearance</label>
                        <div className="flex gap-2">
                            <Button
                                variant={theme === 'dark' ? 'default' : 'outline'}
                                onClick={() => setTheme('dark')}
                                className="flex-1 bg-black/20 border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white"
                            >
                                <Moon className="h-4 w-4 mr-2" />
                                Dark Mode
                            </Button>
                            <Button
                                variant={theme === 'light' ? 'default' : 'outline'}
                                onClick={() => setTheme('light')}
                                className="flex-1 bg-white/20 border-black/10 hover:bg-black/5 text-muted-foreground hover:text-black dark:hover:text-white"
                            >
                                <Sun className="h-4 w-4 mr-2" />
                                Light Mode
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col pt-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Typography</label>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <Button
                                    variant={fontStyle === 'sans' ? 'default' : 'outline'}
                                    onClick={() => setFontStyle('sans')}
                                    className="flex-1 bg-black/20 border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white"
                                >
                                    <Type className="h-4 w-4 mr-1" />
                                    Modern
                                </Button>
                                <Button
                                    variant={fontStyle === 'serif' ? 'default' : 'outline'}
                                    onClick={() => setFontStyle('serif')}
                                    className="flex-1 bg-black/20 border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white font-serif"
                                >
                                    <Type className="h-4 w-4 mr-1" />
                                    Classic
                                </Button>
                                <Button
                                    variant={fontStyle === 'mono' ? 'default' : 'outline'}
                                    onClick={() => setFontStyle('mono')}
                                    className="flex-1 bg-black/20 border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white font-mono"
                                >
                                    <Type className="h-4 w-4 mr-1" />
                                    Code
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={fontSize === 'small' ? 'default' : 'outline'}
                                    onClick={() => setFontSize('small')}
                                    className="flex-1 bg-black/5 dark:bg-black/20 border-border hover:bg-black/10 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground text-xs"
                                >
                                    <ALargeSmall className="h-3 w-3 mr-1" />
                                    Small
                                </Button>
                                <Button
                                    variant={fontSize === 'medium' ? 'default' : 'outline'}
                                    onClick={() => setFontSize('medium')}
                                    className="flex-1 bg-black/5 dark:bg-black/20 border-border hover:bg-black/10 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground text-sm"
                                >
                                    <ALargeSmall className="h-4 w-4 mr-1" />
                                    Medium
                                </Button>
                                <Button
                                    variant={fontSize === 'large' ? 'default' : 'outline'}
                                    onClick={() => setFontSize('large')}
                                    className="flex-1 bg-black/5 dark:bg-black/20 border-border hover:bg-black/10 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground text-base"
                                >
                                    <ALargeSmall className="h-5 w-5 mr-1" />
                                    Large
                                </Button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-destructive/20 border border-destructive/30 p-3 text-sm text-destructive flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg bg-primary/20 border border-primary/30 p-3 text-sm text-primary flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> {success}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t border-border pt-4">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="destructive" onClick={handleDeleteAccount} className="w-full sm:w-auto bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive">
                            Delete Account
                        </Button>
                        <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto bg-transparent border-border hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground">
                            Logout
                        </Button>
                    </div>

                    <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
