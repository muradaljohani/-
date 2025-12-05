
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertOctagon, Info, X } from 'lucide-react';

type ToastType = 'success' | 'security' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 z-[10000] flex flex-col gap-2 w-full max-w-sm px-4 md:px-0 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl animate-fade-in-up transition-all transform hover:scale-102 ${
              toast.type === 'success' ? 'bg-emerald-900/80 border-emerald-500/50 text-emerald-100' :
              toast.type === 'security' ? 'bg-red-900/80 border-red-500/50 text-red-100' :
              'bg-blue-900/80 border-cyan-500/50 text-cyan-100'
            }`}
          >
            <div className={`p-2 rounded-full ${
               toast.type === 'success' ? 'bg-emerald-500/20' :
               toast.type === 'security' ? 'bg-red-500/20' :
               'bg-cyan-500/20'
            }`}>
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'security' && <AlertOctagon className="w-5 h-5 animate-pulse" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-sm font-bold font-sans">{toast.message}</div>
            <button 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="opacity-70 hover:opacity-100"
            >
                <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
