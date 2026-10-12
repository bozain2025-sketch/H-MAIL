import React, { useState } from 'react';
import { useMailStore, ActiveView } from '../../store/mailStore';
import {
  Inbox,
  Star,
  FileText,
  Send,
  Archive,
  ChevronDown,
  ChevronRight,
  Plus,
  AlertCircle,
  Clock,
  RotateCw,
  FolderOpen,
  CheckCircle2,
  PauseCircle,
} from 'lucide-react';
import { AccountStatus } from '../../types/mail';

export const Sidebar: React.FC = () => {
  const {
    accounts,
    messages,
    activeView,
    selectedAccountId,
    selectedGroupName,
    setActiveView,
    openAccountManager,
    settings,
  } = useMailStore();

  const isRtl = settings.language === 'ar';
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Calculations for navigation badges
  const totalUnreadInbox = messages.filter((m) => m.folderId === 'inbox' && !m.isRead).length;
  const totalStarred = messages.filter((m) => m.isStarred).length;
  const totalDrafts = messages.filter((m) => m.folderId === 'drafts').length;
  const totalSent = messages.filter((m) => m.folderId === 'sent').length;
  const totalArchive = messages.filter((m) => m.folderId === 'archive').length;

  // Group accounts
  const groups = Array.from(new Set(accounts.map((a) => a.groupName)));

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const getStatusIcon = (status: AccountStatus) => {
    switch (status) {
      case 'ready':
        return (
          <span title={isRtl ? 'جاهز ومحدث' : 'Ready'} className="inline-flex">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </span>
        );
      case 'syncing':
        return (
          <span title={isRtl ? 'جارٍ المزامنة' : 'Syncing'} className="inline-flex">
            <RotateCw className="w-2.5 h-2.5 text-ui-accent animate-spin" />
          </span>
        );
      case 'rate_limited':
        return (
          <span title={isRtl ? 'محدود المعدل (Throttled)' : 'Rate limited'} className="inline-flex">
            <Clock className="w-2.5 h-2.5 text-amber-500" />
          </span>
        );
      case 'auth_required':
      case 'error':
        return (
          <span title={isRtl ? 'يحتاج إعادة مصادقة' : 'Needs attention'} className="inline-flex">
            <AlertCircle className="w-2.5 h-2.5 text-ui-danger" />
          </span>
        );
      case 'paused':
        return (
          <span title={isRtl ? 'متوقف مؤقتًا' : 'Paused'} className="inline-flex">
            <PauseCircle className="w-2.5 h-2.5 text-ui-fg-muted" />
          </span>
        );
      default:
        return <span className="w-2 h-2 rounded-full bg-gray-400" />;
    }
  };

  const navItems: { view: ActiveView; labelAr: string; labelEn: string; icon: React.ReactNode; count: number }[] = [
    {
      view: 'unified_inbox',
      labelAr: 'صندوق الوارد الموحد',
      labelEn: 'Unified Inbox',
      icon: <Inbox className="w-4 h-4 text-ui-accent" />,
      count: totalUnreadInbox,
    },
    {
      view: 'starred',
      labelAr: 'المميزة بنجمة',
      labelEn: 'Starred',
      icon: <Star className="w-4 h-4 text-amber-500" />,
      count: totalStarred,
    },
    {
      view: 'drafts',
      labelAr: 'المسودات',
      labelEn: 'Drafts',
      icon: <FileText className="w-4 h-4 text-ui-fg-muted" />,
      count: totalDrafts,
    },
    {
      view: 'sent',
      labelAr: 'الرسائل المرسلة',
      labelEn: 'Sent',
      icon: <Send className="w-4 h-4 text-ui-fg-muted" />,
      count: totalSent,
    },
    {
      view: 'archive',
      labelAr: 'الأرشيف',
      labelEn: 'Archive',
      icon: <Archive className="w-4 h-4 text-ui-fg-muted" />,
      count: totalArchive,
    },
  ];

  return (
    <aside
      aria-label={isRtl ? 'الشريط الجانبي للمجلدات والحسابات' : 'Navigation Sidebar'}
      className="w-64 flex-shrink-0 flex flex-col h-full bg-ui-sidebar border-inline-end border-ui-border select-none overflow-hidden"
    >
      {/* Top Standard Destinations */}
      <div className="p-2 space-y-0.5 border-b border-ui-border/60">
        <div className="text-[11px] font-semibold text-ui-fg-muted uppercase tracking-wider px-2 py-1">
          {isRtl ? 'المجلدات الرئيسية' : 'Favorites'}
        </div>
        {navItems.map((item) => {
          const isActive = activeView === item.view && selectedAccountId === null && selectedGroupName === null;
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view, null, null)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-ui-accent text-ui-fg-on-accent shadow-xs'
                  : 'text-ui-fg hover:bg-ui-panel/60 hover:text-ui-fg'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={isActive ? 'text-ui-fg-on-accent' : ''}>{item.icon}</span>
                <span>{isRtl ? item.labelAr : item.labelEn}</span>
              </div>
              {item.count > 0 && (
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-ui-fg-on-accent'
                      : 'bg-ui-border/60 text-ui-fg-muted'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Account Groups and Accounts List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-[11px] font-semibold text-ui-fg-muted uppercase tracking-wider">
            {isRtl ? 'الحسابات والمجموعات' : 'Accounts & Groups'}
          </span>
          <button
            onClick={openAccountManager}
            className="p-1 text-ui-fg-muted hover:text-ui-fg rounded hover:bg-ui-panel transition-colors"
            title={isRtl ? 'إضافة حساب جديد' : 'Add account'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {groups.map((group) => {
          const isCollapsed = collapsedGroups[group];
          const groupAccounts = accounts.filter((a) => a.groupName === group);
          const groupUnread = groupAccounts.reduce((acc, a) => acc + a.unreadCount, 0);
          const isGroupActive = activeView === 'group' && selectedGroupName === group;

          return (
            <div key={group} className="space-y-0.5">
              {/* Group Header */}
              <div
                className={`flex items-center justify-between px-2 py-1 rounded text-xs text-ui-fg-muted hover:text-ui-fg hover:bg-ui-panel/40 cursor-pointer ${
                  isGroupActive ? 'bg-ui-panel font-medium text-ui-fg' : ''
                }`}
                onClick={() => setActiveView('group', null, group)}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroup(group);
                    }}
                    className="p-0.5 hover:text-ui-fg"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                  <FolderOpen className="w-3.5 h-3.5 text-ui-accent" />
                  <span className="truncate">{group}</span>
                </div>
                {groupUnread > 0 && (
                  <span className="text-[10px] font-mono px-1 rounded bg-ui-border text-ui-fg-muted">
                    {groupUnread}
                  </span>
                )}
              </div>

              {/* Group's Accounts */}
              {!isCollapsed && (
                <div className="space-y-0.5 mr-2 ml-1">
                  {groupAccounts.map((account) => {
                    const isAccountActive =
                      activeView === 'account' && selectedAccountId === account.id;

                    return (
                      <button
                        key={account.id}
                        onClick={() => setActiveView('account', account.id, null)}
                        className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors ${
                          isAccountActive
                            ? 'bg-ui-accent text-ui-fg-on-accent shadow-xs'
                            : 'text-ui-fg hover:bg-ui-panel/70'
                        }`}
                        title={`${account.displayName} (${account.email})`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {/* Color bar & status */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: account.color }}
                            />
                            {getStatusIcon(account.status)}
                          </div>

                          <bdi className="truncate text-start font-sans text-[11.5px]">
                            {account.email}
                          </bdi>
                        </div>

                        {account.unreadCount > 0 && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                              isAccountActive
                                ? 'bg-white/20 text-ui-fg-on-accent'
                                : 'bg-ui-accent-soft text-ui-accent font-semibold'
                            }`}
                          >
                            {account.unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer: Health Overview */}
      <div className="p-2.5 border-t border-ui-border bg-ui-panel/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-ui-fg-muted truncate">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="truncate text-[11px]">
            {isRtl
              ? `${accounts.length} حسابات مرتبطة`
              : `${accounts.length} accounts connected`}
          </span>
        </div>

        <button
          onClick={openAccountManager}
          className="text-[11px] text-ui-accent hover:underline font-medium"
        >
          {isRtl ? 'الإدارة' : 'Manage'}
        </button>
      </div>
    </aside>
  );
};
