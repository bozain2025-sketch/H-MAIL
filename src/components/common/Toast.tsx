import React from 'react';
import { useMailStore } from '../../store/mailStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useMailStore();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-ui-danger" />;
      default:
        return <Info className="w-4 h-4 text-ui-accent" />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 start-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-ui-border bg-ui-panel text-ui-fg shadow-lg text-xs select-none animate-in fade-in slide-in-from-bottom-2"
    >
      {getIcon()}
      <span className="font-medium text-ui-fg">{toast.text}</span>

      {toast.onAction && toast.actionLabel && (
        <button
          onClick={toast.onAction}
          className="ms-2 px-2 py-0.5 rounded bg-ui-accent text-ui-fg-on-accent text-[11px] font-semibold hover:opacity-90"
        >
          {toast.actionLabel}
        </button>
      )}

      <button
        onClick={dismissToast}
        className="ms-1 p-0.5 text-ui-fg-muted hover:text-ui-fg rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
