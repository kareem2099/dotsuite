"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { AlertTriangle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ConfirmOptions {
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "default";
}

interface ConfirmState {
    message: string;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
}

interface ConfirmContextValue {
    confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useConfirm(): ConfirmContextValue {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
    return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ConfirmState | null>(null);

    const confirm = useCallback(
        (message: string, options: ConfirmOptions = {}): Promise<boolean> => {
            return new Promise((resolve) => {
                setState({ message, options, resolve });
            });
        },
        []
    );

    const handleChoice = (value: boolean) => {
        state?.resolve(value);
        setState(null);
    };

    const { title, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "danger" } =
        state?.options ?? {};

    const confirmColors =
        variant === "danger"
            ? "bg-(--danger) hover:opacity-80 text-white"
            : variant === "warning"
                ? "bg-(--warning) hover:opacity-80 text-white"
                : "bg-(--primary) hover:bg-(--primary-hover) text-(--background)";

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Modal overlay */}
            {state && (
                <div
                    className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-(--background)/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => handleChoice(false)}
                >
                    <div
                        className="bg-(--card-bg) border border-(--card-border) rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${variant === "danger" ? "bg-(--danger-bg)" : "bg-(--warning-bg)"
                                }`}>
                                <AlertTriangle className={`w-5 h-5 ${variant === "danger" ? "text-(--danger)" : "text-(--warning)"
                                    }`} />
                            </div>
                            {title && (
                                <h3 className="text-base font-semibold text-(--foreground)">{title}</h3>
                            )}
                        </div>

                        {/* Message */}
                        <p className="text-sm text-(--text-muted) mb-6 leading-relaxed">
                            {state.message}
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => handleChoice(false)}
                                className="px-4 py-2 text-sm font-medium border border-(--card-border) text-(--foreground) rounded-lg hover:bg-(--card-border)/50 transition-colors"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                onClick={() => handleChoice(true)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${confirmColors}`}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}
