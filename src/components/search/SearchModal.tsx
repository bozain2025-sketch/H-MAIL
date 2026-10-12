import React, { useState, useMemo } from 'react';
import { useMailStore } from '../../store/mailStore';
import {
  Search,
  X,
  Paperclip,
  Inbox,
  Database,
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    closeSearchModal,
    messages,
    accounts,
    selectMessage,
    settings,
  } = useMailStore();

  const isRtl = settings.language === 'ar';
  const [query, setQuery] = useState('');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [onlyWithAttachments, setOnlyWithAttachments] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(false);

  if (!isSearchModalOpen) return null;

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    return messages.filter((m) => {
      if (filterAccount !== 'all' && m.accountId !== filterAccount) return false;
      if (onlyWithAttachments && !m.hasAttachment) return false;
      if (onlyUnread && m.isRead) return false;

      const inSubject = m.subject.toLowerCase().includes(q);
      const inFrom = m.fromName.toLowerCase().includes(q) || m.fromAddress.toLowerCase().includes(q);
      const inSnippet = m.snippet.toLowerCase().includes(q);
      const inBody = m.bodyPlain.toLowerCase().includes(q);

      return inSubject || inFrom || inSnippet || inBody;
    });
  }, [messages, query, filterAccount, onlyWithAttachments, onlyUnread]);

  const handleSelectResult = (messageId: string) => {
    selectMessage(messageId);
    closeSearchModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isRtl ? 'البحث الشامل في الرسائل' : 'Global search'}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/50 backdrop-blur-xs select-none"
    >
      <div className="w-[680px] max-w-full max-h-[80vh] rounded-lg border border-ui-border bg-ui-panel shadow-mac-modal flex flex-col overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-ui-border flex items-center gap-2.5 bg-ui-panel">
          <Search className="w-4 h-4 text-ui-accent flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isRtl
                ? 'ابحث في موضوع الرسالة، اسم المرسل، أو النص الكامل...'
                : 'Search by subject, sender, or message body...'
            }
            className="flex-1 bg-transparent text-sm text-ui-fg placeholder:text-ui-fg-muted/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-ui-bg text-ui-fg-muted hover:text-ui-fg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="font-mono text-[10px] bg-ui-bg px-2 py-0.5 rounded border border-ui-border text-ui-fg-muted">
            ESC {isRtl ? 'للإغلاق' : 'to close'}
          </kbd>
        </div>

        {/* Local Index Scope Disclaimer (Mandatory local-first honesty rule) */}
        <div className="px-3 py-1.5 bg-ui-bg/70 border-b border-ui-border flex items-center justify-between text-[11px] text-ui-fg-muted">
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-emerald-500" />
            <span>
              {isRtl
                ? 'البحث يشمل الرسائل المفهرسة محليًا فقط (آخر 30 يومًا / 200 رسالة لكل حساب).'
                : 'Searching locally indexed messages only (last 30 days / 200 messages per account).'}
            </span>
          </div>

          <span className="font-mono">
            {searchResults.length} {isRtl ? 'نتيجة' : 'results'}
          </span>
        </div>

        {/* Filters Row */}
        <div className="p-2 border-b border-ui-border/60 bg-ui-panel flex items-center gap-2 text-xs flex-wrap">
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="bg-ui-bg border border-ui-border rounded px-2 py-1 text-xs text-ui-fg focus:outline-none"
          >
            <option value="all">{isRtl ? 'كافة الحسابات' : 'All Accounts'}</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.displayName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOnlyUnread(!onlyUnread)}
            className={`px-2 py-1 rounded border text-[11px] transition-colors ${
              onlyUnread
                ? 'bg-ui-accent text-ui-fg-on-accent border-ui-accent'
                : 'bg-ui-bg border-ui-border text-ui-fg-muted'
            }`}
          >
            {isRtl ? 'غير مقروءة فقط' : 'Unread only'}
          </button>

          <button
            onClick={() => setOnlyWithAttachments(!onlyWithAttachments)}
            className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 transition-colors ${
              onlyWithAttachments
                ? 'bg-ui-accent text-ui-fg-on-accent border-ui-accent'
                : 'bg-ui-bg border-ui-border text-ui-fg-muted'
            }`}
          >
            <Paperclip className="w-3 h-3" />
            <span>{isRtl ? 'مرفقات فقط' : 'With files'}</span>
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-ui-border/60 p-2">
          {!query.trim() ? (
            <div className="p-8 text-center text-ui-fg-muted text-xs">
              <Search className="w-8 h-8 opacity-30 mx-auto mb-2" />
              <p>{isRtl ? 'اكتب كلمة البحث للبدء' : 'Type a query to search local index'}</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-ui-fg-muted text-xs">
              <Inbox className="w-8 h-8 opacity-30 mx-auto mb-2" />
              <p>{isRtl ? 'لا توجد رسائل مطابقة لكلمة البحث في الفهرس المحلي' : 'No matching messages in local index'}</p>
            </div>
          ) : (
            searchResults.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectResult(msg.id)}
                className="p-2.5 rounded-md hover:bg-ui-bg cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: msg.accountColor }}
                    />
                    <span className="font-semibold text-ui-fg">{msg.fromName}</span>
                    <bdi className="text-[11px] text-ui-fg-muted font-mono">&lt;{msg.fromAddress}&gt;</bdi>
                  </div>

                  <span className="text-[10px] text-ui-fg-muted font-mono">
                    {new Date(msg.receivedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs font-medium text-ui-fg truncate">
                  {msg.subject}
                </div>

                <div className="text-[11px] text-ui-fg-muted truncate">
                  {msg.snippet}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
