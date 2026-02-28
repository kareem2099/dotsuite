"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    toast: {
        success: (message: string) => void;
        error: (message: string) => void;
        warning: (message: string) => void;
        info: (message: string) => void;
    };
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

const CONFIGS: Record<ToastType, { icon: ReactNode; bg: string; border: string; text: string; progress: string }> = {
    success: {
        icon: <CheckCircle className="w-5 h-5 shrink-0" />,
        bg: "bg-(--card-bg)",
        border: "border-(--primary)/30",
        text: "text-(--primary)",
        progress: "bg-(--primary)",
    },
    error: {
        icon: <XCircle className="w-5 h-5 shrink-0" />,
        bg: "bg-(--card-bg)",
        border: "border-(--danger)/30",
        text: "text-(--danger)",
        progress: "bg-(--danger)",
    },
    warning: {
        icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
        bg: "bg-(--card-bg)",
        border: "border-(--warning)/30",
        text: "text-(--warning)",
        progress: "bg-(--warning)",
    },
    info: {
        icon: <Info className="w-5 h-5 shrink-0" />,
        bg: "bg-(--card-bg)",
        border: "border-(--primary)/20",
        text: "text-(--text-muted)",
        progress: "bg-(--primary)/50",
    },
};

const DURATION = 4000;

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const config = CONFIGS[toast.type];
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        // mount → slide in
        const enter = setTimeout(() => setVisible(true), 10);
        // auto dismiss
        const leave = setTimeout(() => handleClose(), DURATION);
        return () => { clearTimeout(enter); clearTimeout(leave); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = useCallback(() => {
        setLeaving(true);
        setTimeout(() => onRemove(toast.id), 300);
    }, [onRemove, toast.id]);

    return (
        <div
            role="alert"
            className={`
        flex items-start gap-3 w-80 px-4 py-3 rounded-xl shadow-lg
        border backdrop-blur-sm
        ${config.bg} ${config.border}
        transition-all duration-300 ease-out
        ${visible && !leaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        overflow-hidden relative
      `}
        >
            {/* Icon */}
            <span className={config.text}>{config.icon}</span>

            {/* Message */}
            <p className={`text-sm font-medium flex-1 leading-snug ${config.text}`}>
                {toast.message}
            </p>

            {/* Close */}
            <button
                onClick={handleClose}
                className={`${config.text} opacity-60 hover:opacity-100 transition-opacity shrink-0`}
                aria-label="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <div
                className={`absolute bottom-0 left-0 h-0.5 ${config.progress} rounded-full`}
                style={{
                    animation: `toast-progress ${DURATION}ms linear forwards`,
                }}
            />
        </div>
    );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const idRef = useRef(0);

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = String(++idRef.current);
        setToasts((prev) => [...prev, { id, type, message }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (msg: string) => addToast("success", msg),
        error: (msg: string) => addToast("error", msg),
        warning: (msg: string) => addToast("warning", msg),
        info: (msg: string) => addToast("info", msg),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast Container */}
            <div
                aria-live="polite"
                aria-atomic="false"
                className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
            >
                {toasts.map((t) => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem toast={t} onRemove={removeToast} />
                    </div>
                ))}
            </div>

            {/* Progress bar keyframe */}
            <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </ToastContext.Provider>
    );
}
