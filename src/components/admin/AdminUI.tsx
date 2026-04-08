'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ============ TOAST ============
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContext = createContext<{
  toast: (message: string, type?: Toast['type']) => void;
}>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[500] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-up ${
              t.type === 'success'
                ? 'bg-moss-600 text-white'
                : t.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-ink text-sand-100'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ============ CONFIRM DIALOG ============
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Potvrdiť',
  onConfirm,
  onCancel,
  destructive = false,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/30" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-sand-600 mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="btn-outline !py-2 !px-4 !text-xs">Zrušiť</button>
          <button
            onClick={onConfirm}
            className={`!py-2 !px-4 !text-xs rounded-full font-medium transition-all ${
              destructive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'btn-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ PAGINATION ============
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg border border-sand-200 text-xs disabled:opacity-30 hover:border-moss-600 transition-colors"
      >
        ←
      </button>
      <span className="text-sm text-sand-600">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-lg border border-sand-200 text-xs disabled:opacity-30 hover:border-moss-600 transition-colors"
      >
        →
      </button>
    </div>
  );
}

// ============ STAT CARD ============
export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-sand-200 p-5">
      <div className={`text-2xl font-display font-semibold ${accent ? 'text-moss-600' : 'text-ink'}`}>
        {value}
      </div>
      <div className="text-sm text-sand-600 mt-1">{label}</div>
      {sub && <div className="text-xs text-sand-400 mt-0.5">{sub}</div>}
    </div>
  );
}

// ============ BADGE ============
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    paid: 'bg-moss-50 text-moss-600 border-moss-200',
    shipped: 'bg-blue-50 text-blue-600 border-blue-200',
    delivered: 'bg-green-50 text-green-600 border-green-200',
    cancelled: 'bg-red-50 text-red-500 border-red-200',
  };
  const labels: Record<string, string> = {
    pending: 'Čaká na platbu',
    paid: 'Zaplatená',
    shipped: 'Odoslaná',
    delivered: 'Doručená',
    cancelled: 'Zrušená',
  };
  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${styles[status] || 'bg-sand-50 text-sand-600 border-sand-200'}`}>
      {labels[status] || status}
    </span>
  );
}

// ============ SEARCH INPUT ============
export function SearchInput({
  value,
  onChange,
  placeholder = 'Hľadať...',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
      />
    </div>
  );
}

// ============ EMPTY STATE ============
export function EmptyState({ message }: { message: string }) {
  return <p className="text-sand-400 text-center py-12 text-sm">{message}</p>;
}

// ============ LOADING SPINNER ============
export function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-sand-200 border-t-moss-600 rounded-full animate-spin" />
    </div>
  );
}

// ============ useDebounce ============
export function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
