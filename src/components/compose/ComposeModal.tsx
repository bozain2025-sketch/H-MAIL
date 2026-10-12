import React, { useState } from 'react';
import { useMailStore } from '../../store/mailStore';
import {
  X,
  Send,
  Paperclip,
  Trash2,
  Bold,
  Italic,
  List,
  CheckCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react';

export const ComposeModal: React.FC = () => {
  const {
    isComposeOpen,
    closeCompose,
    composeDraft,
    updateComposeDraft,
    sendMessage,
    accounts,
    settings,
  } = useMailStore();

  const isRtl = settings.language === 'ar';
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isComposeOpen) return null;

  const handleSend = async () => {
    if (!composeDraft.to.trim()) {
      useMailStore.getState().showToast({
        text: isRtl ? 'يرجى تحديد عنوان المستلم (To)' : 'Please specify a recipient (To)',
        type: 'warning',
      });
      return;
    }

    setIsSending(true);
    await sendMessage(composeDraft);
    setIsSending(false);
  };

  const handleAttachSimulatedFile = () => {
    const fakeFiles = [
      { name: 'Financial_Report_Q3.pdf', size: 1024 * 750 },
      { name: 'Architecture_Diagram.png', size: 1024 * 320 },
      { name: 'Contract_Draft.docx', size: 1024 * 450 },
    ];
    const pick = fakeFiles[Math.floor(Math.random() * fakeFiles.length)];
    updateComposeDraft({
      attachments: [...composeDraft.attachments, pick],
    });
  };

  const removeAttachment = (index: number) => {
    updateComposeDraft({
      attachments: composeDraft.attachments.filter((_, i) => i !== index),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isRtl ? 'نافذة كتابة رسالة جديدة' : 'Compose message'}
      className={`fixed z-50 transition-all select-none ${
        isMinimized
          ? 'bottom-0 right-8 w-80 h-11 shadow-lg'
          : 'bottom-4 right-6 sm:right-12 w-[620px] max-w-[95vw] h-[580px] max-h-[90vh] shadow-mac-modal'
      } rounded-t-lg rounded-b-lg border border-ui-border bg-ui-panel flex flex-col overflow-hidden`}
    >
      {/* Titlebar / Header */}
      <div className="h-10 px-3 bg-ui-bg border-b border-ui-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-ui-fg">
            {isRtl ? 'رسالة جديدة' : 'New Message'}
          </span>
          <span className="text-[10px] text-ui-fg-muted font-mono flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
            {isRtl ? 'محفوظة محليًا' : 'Draft saved'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-ui-fg-muted">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:text-ui-fg rounded hover:bg-ui-panel"
            title={isMinimized ? (isRtl ? 'تكبير' : 'Restore') : (isRtl ? 'تصغير' : 'Minimize')}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={closeCompose}
            className="p-1 hover:text-ui-danger rounded hover:bg-ui-panel"
            title={isRtl ? 'إغلاق وحفظ كمسودة' : 'Close and save draft'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Header Fields (From, To, Cc, Bcc, Subject) */}
          <div className="p-3 border-b border-ui-border space-y-2 text-xs bg-ui-panel">
            {/* Explicit From Selector (Crucial Multi-Account Rule) */}
            <div className="flex items-center justify-between gap-2">
              <span className="w-12 text-ui-fg-muted font-medium">{isRtl ? 'من:' : 'From:'}</span>
              <div className="flex-1">
                <select
                  value={composeDraft.fromAccountId}
                  onChange={(e) => updateComposeDraft({ fromAccountId: e.target.value })}
                  className="w-full bg-ui-bg border border-ui-border rounded px-2.5 py-1 text-xs text-ui-fg font-medium focus:outline-none focus:border-ui-accent"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.displayName} &lt;{acc.email}&gt; ({acc.provider.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* To Recipient */}
            <div className="flex items-center justify-between gap-2">
              <span className="w-12 text-ui-fg-muted font-medium">{isRtl ? 'إلى:' : 'To:'}</span>
              <div className="flex-1 flex items-center gap-1">
                <input
                  type="text"
                  value={composeDraft.to}
                  onChange={(e) => updateComposeDraft({ to: e.target.value })}
                  placeholder={isRtl ? 'عنوان البريد الإلكتروني للمستلم...' : 'recipient@example.com'}
                  className="flex-1 bg-transparent border-none text-xs text-ui-fg focus:outline-none placeholder:text-ui-fg-muted/60"
                />
                {!showCc && (
                  <button
                    onClick={() => setShowCc(true)}
                    className="text-[11px] text-ui-fg-muted hover:text-ui-fg px-1"
                  >
                    Cc
                  </button>
                )}
                {!showBcc && (
                  <button
                    onClick={() => setShowBcc(true)}
                    className="text-[11px] text-ui-fg-muted hover:text-ui-fg px-1"
                  >
                    Bcc
                  </button>
                )}
              </div>
            </div>

            {/* CC */}
            {showCc && (
              <div className="flex items-center justify-between gap-2">
                <span className="w-12 text-ui-fg-muted font-medium">Cc:</span>
                <input
                  type="text"
                  value={composeDraft.cc}
                  onChange={(e) => updateComposeDraft({ cc: e.target.value })}
                  placeholder="cc@example.com"
                  className="flex-1 bg-transparent border-none text-xs text-ui-fg focus:outline-none"
                />
              </div>
            )}

            {/* BCC */}
            {showBcc && (
              <div className="flex items-center justify-between gap-2">
                <span className="w-12 text-ui-fg-muted font-medium">Bcc:</span>
                <input
                  type="text"
                  value={composeDraft.bcc}
                  onChange={(e) => updateComposeDraft({ bcc: e.target.value })}
                  placeholder="bcc@example.com"
                  className="flex-1 bg-transparent border-none text-xs text-ui-fg focus:outline-none"
                />
              </div>
            )}

            {/* Subject */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-ui-border/40">
              <span className="w-12 text-ui-fg-muted font-medium">{isRtl ? 'الموضوع:' : 'Subject:'}</span>
              <input
                type="text"
                value={composeDraft.subject}
                onChange={(e) => updateComposeDraft({ subject: e.target.value })}
                placeholder={isRtl ? 'عنوان الرسالة...' : 'Subject...'}
                className="flex-1 bg-transparent border-none text-xs text-ui-fg font-medium focus:outline-none placeholder:text-ui-fg-muted/60"
              />
            </div>
          </div>

          {/* Formatting Bar */}
          <div className="px-3 py-1 bg-ui-bg/50 border-b border-ui-border flex items-center gap-2 text-ui-fg-muted text-xs">
            <button
              onClick={handleAttachSimulatedFile}
              className="p-1 hover:text-ui-fg rounded hover:bg-ui-panel flex items-center gap-1"
              title={isRtl ? 'إرفاق ملف' : 'Attach file'}
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="text-[11px]">{isRtl ? 'إرفاق' : 'Attach'}</span>
            </button>

            <div className="h-3 w-[1px] bg-ui-border" />

            <button className="p-1 hover:text-ui-fg rounded hover:bg-ui-panel" title="Bold">
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:text-ui-fg rounded hover:bg-ui-panel" title="Italic">
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:text-ui-fg rounded hover:bg-ui-panel" title="List">
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Attachments Chips */}
          {composeDraft.attachments.length > 0 && (
            <div className="px-3 py-1.5 bg-ui-bg/30 border-b border-ui-border flex flex-wrap gap-2">
              {composeDraft.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-ui-panel border border-ui-border text-[11px] text-ui-fg"
                >
                  <Paperclip className="w-3 h-3 text-ui-fg-muted" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(idx)}
                    className="p-0.5 text-ui-fg-muted hover:text-ui-danger"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Body Editor */}
          <div className="flex-1 p-3 bg-ui-panel select-text">
            <textarea
              value={composeDraft.body}
              onChange={(e) => updateComposeDraft({ body: e.target.value })}
              placeholder={
                isRtl
                  ? 'اكتب نص الرسالة هنا...'
                  : 'Write your message here...'
              }
              className="w-full h-full bg-transparent text-ui-fg text-xs resize-none focus:outline-none leading-relaxed font-sans"
              dir="auto"
            />
          </div>

          {/* Footer Actions */}
          <div className="p-3 border-t border-ui-border bg-ui-bg flex items-center justify-between">
            <button
              onClick={closeCompose}
              className="p-1.5 text-ui-fg-muted hover:text-ui-danger rounded hover:bg-ui-panel transition-colors"
              title={isRtl ? 'حذف المسودة' : 'Discard draft'}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-ui-fg-muted font-mono hidden sm:inline">
                ⌘Enter {isRtl ? 'للإرسال' : 'to send'}
              </span>

              <button
                onClick={handleSend}
                disabled={isSending || !composeDraft.to.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md bg-ui-accent text-ui-fg-on-accent hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? (isRtl ? 'جارٍ الإرسال...' : 'Sending...') : (isRtl ? 'إرسال' : 'Send')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
