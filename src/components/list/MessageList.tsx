import React, { useRef, useMemo, useEffect } from 'react';
import { useMailStore } from '../../store/mailStore';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Star,
  Paperclip,
  Inbox,
} from 'lucide-react';

export const MessageList: React.FC = () => {
  const {
    messages,
    accounts,
    activeView,
    selectedAccountId,
    selectedGroupName,
    selectedMessageId,
    selectMessage,
    toggleStarred,
    searchQuery,
    filterUnreadOnly,
    setFilterUnreadOnly,
    filterStarredOnly,
    setFilterStarredOnly,
    filterHasAttachment,
    setFilterHasAttachment,
    settings,
  } = useMailStore();

  const isRtl = settings.language === 'ar';
  const parentRef = useRef<HTMLDivElement>(null);

  // Density row heights
  const rowHeight = useMemo(() => {
    switch (settings.density) {
      case 'compact':
        return 52;
      case 'comfortable':
        return 74;
      default:
        return 64;
    }
  }, [settings.density]);

  // Compute filtered messages based on activeView + filters + search
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // View filtering
      if (activeView === 'unified_inbox') {
        if (m.folderId !== 'inbox') return false;
      } else if (activeView === 'starred') {
        if (!m.isStarred) return false;
      } else if (activeView === 'drafts') {
        if (m.folderId !== 'drafts') return false;
      } else if (activeView === 'sent') {
        if (m.folderId !== 'sent') return false;
      } else if (activeView === 'archive') {
        if (m.folderId !== 'archive') return false;
      } else if (activeView === 'account' && selectedAccountId) {
        if (m.accountId !== selectedAccountId) return false;
      } else if (activeView === 'group' && selectedGroupName) {
        const acc = accounts.find((a) => a.id === m.accountId);
        if (acc?.groupName !== selectedGroupName) return false;
      }

      // Filter chips
      if (filterUnreadOnly && m.isRead) return false;
      if (filterStarredOnly && !m.isStarred) return false;
      if (filterHasAttachment && !m.hasAttachment) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubject = m.subject.toLowerCase().includes(q);
        const matchFrom = m.fromName.toLowerCase().includes(q) || m.fromAddress.toLowerCase().includes(q);
        const matchSnippet = m.snippet.toLowerCase().includes(q);
        if (!matchSubject && !matchFrom && !matchSnippet) return false;
      }

      return true;
    });
  }, [
    messages,
    accounts,
    activeView,
    selectedAccountId,
    selectedGroupName,
    filterUnreadOnly,
    filterStarredOnly,
    filterHasAttachment,
    searchQuery,
  ]);

  // Virtualizer instance
  const virtualizer = useVirtualizer({
    count: filteredMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  });

  // Keyboard navigation within list
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (filteredMessages.length === 0) return;

      const currentIndex = filteredMessages.findIndex((m) => m.id === selectedMessageId);

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const nextIndex = Math.min(filteredMessages.length - 1, currentIndex + 1);
        const nextMsg = filteredMessages[nextIndex];
        if (nextMsg) {
          selectMessage(nextMsg.id);
          virtualizer.scrollToIndex(nextIndex);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        const prevMsg = filteredMessages[prevIndex];
        if (prevMsg) {
          selectMessage(prevMsg.id);
          virtualizer.scrollToIndex(prevIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredMessages, selectedMessageId, selectMessage, virtualizer]);

  // Format date cleanly
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Header Title
  const getHeaderTitle = () => {
    if (activeView === 'unified_inbox') {
      return isRtl ? 'صندوق الوارد الموحد' : 'Unified Inbox';
    }
    if (activeView === 'starred') {
      return isRtl ? 'المميزة بنجمة' : 'Starred';
    }
    if (activeView === 'drafts') {
      return isRtl ? 'المسودات' : 'Drafts';
    }
    if (activeView === 'sent') {
      return isRtl ? 'المرسلة' : 'Sent';
    }
    if (activeView === 'archive') {
      return isRtl ? 'الأرشيف' : 'Archive';
    }
    if (activeView === 'account') {
      const acc = accounts.find((a) => a.id === selectedAccountId);
      return acc?.displayName || acc?.email || (isRtl ? 'الحساب' : 'Account');
    }
    if (activeView === 'group') {
      return selectedGroupName || (isRtl ? 'المجموعة' : 'Group');
    }
    return isRtl ? 'الرسائل' : 'Messages';
  };

  const unreadCount = filteredMessages.filter((m) => !m.isRead).length;

  return (
    <section
      aria-label={isRtl ? 'قائمة الرسائل' : 'Message list'}
      className="w-80 md:w-96 flex-shrink-0 flex flex-col h-full bg-ui-panel border-inline-end border-ui-border select-none overflow-hidden"
    >
      {/* List Toolbar / Header */}
      <div className="p-3 border-b border-ui-border/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2 truncate">
            <h1 className="font-semibold text-sm text-ui-fg truncate">
              {getHeaderTitle()}
            </h1>
            <span className="text-xs text-ui-fg-muted font-mono">
              {filteredMessages.length} {isRtl ? 'رسالة' : 'msgs'}
            </span>
          </div>

          {unreadCount > 0 && (
            <span className="text-[11px] font-semibold text-ui-accent bg-ui-accent-soft px-2 py-0.5 rounded-full">
              {unreadCount} {isRtl ? 'غير مقروءة' : 'unread'}
            </span>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
          <button
            onClick={() => {
              setFilterUnreadOnly(false);
              setFilterStarredOnly(false);
              setFilterHasAttachment(false);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              !filterUnreadOnly && !filterStarredOnly && !filterHasAttachment
                ? 'bg-ui-fg text-ui-bg'
                : 'bg-ui-bg border border-ui-border text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            {isRtl ? 'الكل' : 'All'}
          </button>

          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              filterUnreadOnly
                ? 'bg-ui-accent text-ui-fg-on-accent'
                : 'bg-ui-bg border border-ui-border text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ui-accent" />
            {isRtl ? 'غير مقروءة' : 'Unread'}
          </button>

          <button
            onClick={() => setFilterStarredOnly(!filterStarredOnly)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              filterStarredOnly
                ? 'bg-amber-500 text-white'
                : 'bg-ui-bg border border-ui-border text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            <Star className="w-2.5 h-2.5 fill-current" />
            {isRtl ? 'المميزة' : 'Starred'}
          </button>

          <button
            onClick={() => setFilterHasAttachment(!filterHasAttachment)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              filterHasAttachment
                ? 'bg-ui-accent text-ui-fg-on-accent'
                : 'bg-ui-bg border border-ui-border text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            <Paperclip className="w-2.5 h-2.5" />
            {isRtl ? 'مرفقات' : 'Files'}
          </button>
        </div>
      </div>

      {/* Virtualized Messages Container */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto relative divide-y divide-ui-border/50"
        tabIndex={0}
      >
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 px-4 text-center text-ui-fg-muted space-y-2 mt-8">
            <Inbox className="w-8 h-8 opacity-40 text-ui-fg-muted" />
            <p className="text-xs font-medium">
              {isRtl ? 'لا توجد رسائل تطابق معايير العرض' : 'No messages found'}
            </p>
            <p className="text-[11px] text-ui-fg-muted/80 max-w-xs">
              {isRtl
                ? 'جرب إعادة ضبط المرشحات أو مزامنة الحسابات لجلب الرسائل الجديدة.'
                : 'Try adjusting your filters or triggering a sync to fetch new mail.'}
            </p>
          </div>
        ) : (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const msg = filteredMessages[virtualRow.index];
              const isSelected = selectedMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => selectMessage(msg.id)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={`px-3 py-2 cursor-pointer transition-colors flex flex-col justify-between border-b border-ui-border/40 ${
                    isSelected
                      ? 'bg-ui-accent-soft text-ui-fg border-inline-start-4 border-ui-accent font-medium'
                      : 'hover:bg-ui-bg/70 text-ui-fg'
                  } ${!msg.isRead ? 'font-semibold' : ''}`}
                >
                  {/* Top row: Sender, unread dot, account provenance badge, timestamp */}
                  <div className="flex items-center justify-between gap-1.5 text-xs leading-none">
                    <div className="flex items-center gap-1.5 truncate">
                      {!msg.isRead && (
                        <span
                          className="w-2 h-2 rounded-full bg-ui-accent flex-shrink-0"
                          title={isRtl ? 'غير مقروءة' : 'Unread'}
                        />
                      )}
                      <span className="truncate text-ui-fg text-[12.5px]">
                        {msg.fromName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Account origin badge (Crucial provenance rule) */}
                      <span
                        className="text-[9.5px] px-1 py-0.2 rounded font-mono truncate max-w-[90px] border border-black/10 dark:border-white/10"
                        style={{
                          backgroundColor: `${msg.accountColor}20`,
                          color: msg.accountColor,
                        }}
                        title={`Received via ${msg.accountEmail}`}
                      >
                        {msg.accountEmail.split('@')[0]}
                      </span>

                      <span className="text-[10px] text-ui-fg-muted font-mono">
                        {formatTime(msg.receivedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Middle row: Subject & indicators */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-ui-fg text-[12px] leading-tight">
                      {msg.subject}
                    </span>

                    <div className="flex items-center gap-1 flex-shrink-0 text-ui-fg-muted">
                      {msg.hasAttachment && (
                        <span title={isRtl ? 'يحتوي مرفقات' : 'Has attachment'}>
                          <Paperclip className="w-3 h-3 text-ui-fg-muted" />
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarred(msg.id);
                        }}
                        className="p-0.5 hover:text-amber-500 transition-colors"
                        title={msg.isStarred ? (isRtl ? 'إزالة التمييز' : 'Unstar') : (isRtl ? 'تمييز بنجمة' : 'Star')}
                      >
                        <Star
                          className={`w-3 h-3 ${
                            msg.isStarred
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-ui-fg-muted/40 hover:text-ui-fg-muted'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Bottom row: Snippet preview (clipped) */}
                  <p className="text-[11px] text-ui-fg-muted truncate leading-normal">
                    {msg.snippet}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
