import React, { useState } from 'react';
import { useMailStore } from '../../store/mailStore';
import {
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  Star,
  Mail,
  Download,
  ShieldAlert,
  Paperclip,
  Send,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Attachment } from '../../types/mail';

export const MessageReader: React.FC = () => {
  const {
    messages,
    accounts,
    selectedMessageId,
    archiveMessage,
    deleteMessage,
    toggleStarred,
    toggleRead,
    openCompose,
    remoteImagesAllowed,
    allowRemoteImagesForMessage,
    sendMessage,
    settings,
  } = useMailStore();

  const isRtl = settings.language === 'ar';
  const message = messages.find((m) => m.id === selectedMessageId);

  // Quick inline reply state
  const [inlineReplyText, setInlineReplyText] = useState('');
  const [replyFromAccountId, setReplyFromAccountId] = useState<string>('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [showRecipientDetails, setShowRecipientDetails] = useState(false);

  // Keep replyFromAccountId in sync with message account
  React.useEffect(() => {
    if (message) {
      setReplyFromAccountId(message.accountId);
    }
  }, [message?.id]);

  if (!message) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-ui-panel text-ui-fg-muted select-none">
        <Mail className="w-12 h-12 opacity-30 mb-3" />
        <h2 className="text-sm font-medium">
          {isRtl ? 'لم يتم تحديد أي رسالة' : 'No message selected'}
        </h2>
        <p className="text-xs text-ui-fg-muted/80 mt-1 max-w-sm text-center">
          {isRtl
            ? 'اختر رسالة من القائمة لقراءتها أو استخدم مفاتيح الأسهم للتنقل السريع.'
            : 'Select an email from the list to view its contents, or use arrow keys.'}
        </p>
      </div>
    );
  }

  const account = accounts.find((a) => a.id === message.accountId);
  const areRemoteImagesAllowed = remoteImagesAllowed.has(message.id);

  // Handle Quick Reply submit
  const handleQuickReply = async () => {
    if (!inlineReplyText.trim()) return;
    setIsSendingReply(true);

    await sendMessage({
      fromAccountId: replyFromAccountId || message.accountId,
      to: message.fromAddress,
      cc: '',
      bcc: '',
      subject: message.subject.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
      body: inlineReplyText,
      attachments: [],
      isReplyingToId: message.id,
    });

    setInlineReplyText('');
    setIsSendingReply(false);
  };

  const handleDownloadAttachment = (att: Attachment) => {
    useMailStore.getState().showToast({
      text: isRtl
        ? `تم تنزيل المرفق بأمان: ${att.filename}`
        : `Attachment downloaded safely: ${att.filename}`,
      type: 'success',
    });
  };

  return (
    <article
      aria-label={isRtl ? 'محتوى الرسالة' : 'Message reading pane'}
      className="flex-1 flex flex-col h-full bg-ui-panel select-text overflow-hidden"
    >
      {/* Top Action Toolbar */}
      <div className="h-12 px-4 border-b border-ui-border/70 flex items-center justify-between bg-ui-panel select-none">
        {/* Left: Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              openCompose({
                fromAccountId: message.accountId,
                to: message.fromAddress,
                subject: message.subject.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
                body: `\n\n--- On ${new Date(message.receivedAt).toLocaleString()} ${message.fromName} wrote:\n> ${message.bodyPlain.split('\n').join('\n> ')}`,
                isReplyingToId: message.id,
              })
            }
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded hover:bg-ui-bg text-ui-fg font-medium transition-colors"
            title={isRtl ? 'رد (⌘R)' : 'Reply'}
          >
            <Reply className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isRtl ? 'رد' : 'Reply'}</span>
          </button>

          <button
            onClick={() =>
              openCompose({
                fromAccountId: message.accountId,
                to: [message.fromAddress, ...(message.toAddresses || [])].join(', '),
                subject: message.subject.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
                isReplyingToId: message.id,
              })
            }
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded hover:bg-ui-bg text-ui-fg font-medium transition-colors"
            title={isRtl ? 'رد للجميع' : 'Reply All'}
          >
            <ReplyAll className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isRtl ? 'رد للكل' : 'Reply All'}</span>
          </button>

          <button
            onClick={() =>
              openCompose({
                fromAccountId: message.accountId,
                subject: `Fwd: ${message.subject}`,
                body: `\n\n--- Forwarded Message ---\nFrom: ${message.fromName} <${message.fromAddress}>\nSubject: ${message.subject}\n\n${message.bodyPlain}`,
              })
            }
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded hover:bg-ui-bg text-ui-fg font-medium transition-colors"
            title={isRtl ? 'إعادة توجيه' : 'Forward'}
          >
            <Forward className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isRtl ? 'توجيه' : 'Forward'}</span>
          </button>

          <div className="h-4 w-[1px] bg-ui-border mx-1" />

          <button
            onClick={() => archiveMessage(message.id)}
            className="p-1.5 rounded hover:bg-ui-bg text-ui-fg-muted hover:text-ui-fg transition-colors"
            title={isRtl ? 'أرشفة الرسالة (E)' : 'Archive (E)'}
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            onClick={() => deleteMessage(message.id)}
            className="p-1.5 rounded hover:bg-ui-bg text-ui-fg-muted hover:text-ui-danger transition-colors"
            title={isRtl ? 'حذف الرسالة (Delete)' : 'Delete'}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleRead(message.id)}
            className="p-1.5 rounded hover:bg-ui-bg text-ui-fg-muted hover:text-ui-fg transition-colors"
            title={message.isRead ? (isRtl ? 'تمييز كغير مقروءة' : 'Mark as unread') : (isRtl ? 'تمييز كمقروءة' : 'Mark as read')}
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Star & Metadata */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleStarred(message.id)}
            className="p-1.5 rounded hover:bg-ui-bg text-ui-fg-muted hover:text-amber-500 transition-colors"
            title={message.isStarred ? (isRtl ? 'إزالة التمييز' : 'Unstar') : (isRtl ? 'تمييز بنجمة' : 'Star')}
          >
            <Star
              className={`w-4 h-4 ${
                message.isStarred
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-ui-fg-muted hover:text-ui-fg'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Message Header Details */}
      <div className="p-4 border-b border-ui-border/70 space-y-3 bg-ui-panel select-text">
        {/* Account Provenance Banner (Critical Rule) */}
        <div className="flex items-center gap-2 text-xs py-1 px-2.5 rounded bg-ui-bg border border-ui-border/80">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: message.accountColor }} />
          <span className="text-ui-fg-muted">{isRtl ? 'وردت عبر صندوق:' : 'Received via:'}</span>
          <bdi className="font-mono text-ui-fg font-medium">{message.accountEmail}</bdi>
          <span className="text-ui-fg-muted/60">({account?.displayName || account?.provider})</span>
        </div>

        {/* Subject */}
        <h2 className="text-lg font-semibold text-ui-fg leading-snug">
          {message.subject}
        </h2>

        {/* Sender & Recipient Metadata */}
        <div className="flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            {/* Sender Initials Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 text-white"
              style={{ backgroundColor: message.accountColor }}
            >
              {message.fromName.slice(0, 2)}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ui-fg text-sm">{message.fromName}</span>
                <bdi className="text-ui-fg-muted text-xs">&lt;{message.fromAddress}&gt;</bdi>
              </div>

              <div className="text-ui-fg-muted flex items-center gap-1">
                <span>{isRtl ? 'إلى:' : 'To:'}</span>
                <bdi className="text-ui-fg font-medium">{message.toAddresses.join(', ')}</bdi>

                {message.ccAddresses && message.ccAddresses.length > 0 && (
                  <button
                    onClick={() => setShowRecipientDetails(!showRecipientDetails)}
                    className="p-0.5 hover:text-ui-fg text-ui-fg-muted ml-1"
                  >
                    <ChevronDown className="w-3 h-3 inline" />
                  </button>
                )}
              </div>

              {showRecipientDetails && message.ccAddresses && message.ccAddresses.length > 0 && (
                <div className="text-[11px] text-ui-fg-muted pt-1">
                  <span>{isRtl ? 'نسخة:' : 'CC:'} </span>
                  <bdi>{message.ccAddresses.join(', ')}</bdi>
                </div>
              )}
            </div>
          </div>

          <div className="text-ui-fg-muted text-[11px] font-mono whitespace-nowrap">
            {new Date(message.receivedAt).toLocaleString([], {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </div>
        </div>
      </div>

      {/* Untrusted Remote Images Alert Bar */}
      {!areRemoteImagesAllowed && message.bodyHtml && message.bodyHtml.includes('<img') && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              {isRtl
                ? 'تم حظر الصور الخارجية لحماية خصوصيتك ومنع تتبع قراءة البريد.'
                : 'Remote images are blocked to protect your privacy and prevent email tracking.'}
            </span>
          </div>

          <button
            onClick={() => allowRemoteImagesForMessage(message.id)}
            className="px-2.5 py-1 text-xs font-medium rounded bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            {isRtl ? 'عرض الصور' : 'Load Images'}
          </button>
        </div>
      )}

      {/* Message Body Content (Sanitized / BiDi Isolated) */}
      <div
        className="flex-1 overflow-y-auto p-6 select-text text-sm leading-relaxed"
        dir={message.direction}
      >
        {message.bodyHtml && areRemoteImagesAllowed ? (
          <div
            dangerouslySetInnerHTML={{ __html: message.bodyHtml }}
            className="prose dark:prose-invert max-w-none font-sans"
          />
        ) : (
          <div className="whitespace-pre-wrap font-sans text-ui-fg text-[13.5px] leading-relaxed">
            {message.bodyPlain}
          </div>
        )}

        {/* Attachments Section */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-8 pt-4 border-t border-ui-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-ui-fg-muted">
              <Paperclip className="w-3.5 h-3.5" />
              <span>
                {message.attachments.length} {isRtl ? 'مرفقات' : 'Attachments'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-ui-bg border border-ui-border text-xs text-ui-fg hover:border-ui-accent transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium truncate max-w-xs">{att.filename}</div>
                    <div className="text-[10px] text-ui-fg-muted font-mono">
                      {(att.sizeBytes / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadAttachment(att)}
                    className="p-1 rounded hover:bg-ui-panel text-ui-accent transition-colors"
                    title={isRtl ? 'تنزيل المرفق' : 'Download attachment'}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Reply Box at Bottom */}
      <div className="p-3 border-t border-ui-border/70 bg-ui-bg/70 select-none">
        <div className="rounded-lg border border-ui-border bg-ui-panel p-2 shadow-xs space-y-2">
          {/* Explicit "From" selector for safety */}
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-1.5 text-ui-fg-muted">
              <span className="font-medium text-ui-fg">{isRtl ? 'الرد بواسطة:' : 'Reply from:'}</span>
              <select
                value={replyFromAccountId}
                onChange={(e) => setReplyFromAccountId(e.target.value)}
                className="bg-ui-bg border border-ui-border rounded px-2 py-0.5 text-xs text-ui-fg font-medium focus:outline-none focus:border-ui-accent"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.email} ({acc.displayName})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[11px] text-ui-fg-muted font-mono">
              To: {message.fromAddress}
            </span>
          </div>

          <textarea
            value={inlineReplyText}
            onChange={(e) => setInlineReplyText(e.target.value)}
            placeholder={
              isRtl
                ? `اكتب ردًا سريعًا على ${message.fromName}...`
                : `Write a quick reply to ${message.fromName}...`
            }
            rows={2}
            className="w-full bg-transparent text-ui-fg placeholder:text-ui-fg-muted/60 text-xs resize-none focus:outline-none"
          />

          <div className="flex items-center justify-between pt-1 border-t border-ui-border/40">
            <button
              onClick={() =>
                openCompose({
                  fromAccountId: replyFromAccountId || message.accountId,
                  to: message.fromAddress,
                  subject: message.subject.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
                  body: inlineReplyText,
                  isReplyingToId: message.id,
                })
              }
              className="text-[11px] text-ui-fg-muted hover:text-ui-accent font-medium flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{isRtl ? 'توسيع في محرر كامل' : 'Open full composer'}</span>
            </button>

            <button
              onClick={handleQuickReply}
              disabled={isSendingReply || !inlineReplyText.trim()}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-ui-accent text-ui-fg-on-accent hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{isSendingReply ? (isRtl ? 'جارٍ الإرسال...' : 'Sending...') : (isRtl ? 'إرسال الرد' : 'Send')}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
