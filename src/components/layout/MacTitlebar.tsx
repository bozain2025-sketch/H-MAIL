import React from 'react';
import { useMailStore } from '../../store/mailStore';
import {
  Search,
  RefreshCw,
  PenSquare,
  Sun,
  Moon,
  Globe,
  Settings,
  Users,
} from 'lucide-react';

export const MacTitlebar: React.FC = () => {
  const {
    settings,
    setTheme,
    setLanguage,
    openCompose,
    openSettings,
    openAccountManager,
    openSearchModal,
    triggerSyncAll,
    isSyncingAll,
    accounts,
  } = useMailStore();

  const isRtl = settings.language === 'ar';
  const accountsNeedingAttention = accounts.filter(
    (a) => a.status === 'auth_required' || a.status === 'error' || a.status === 'rate_limited'
  ).length;

  return (
    <header
      role="banner"
      className="h-11 flex-shrink-0 flex items-center justify-between px-3 border-b border-ui-border bg-ui-bg select-none z-30"
    >
      {/* macOS Traffic Lights Simulation */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-1 py-1 group">
          <span
            className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-flex items-center justify-center text-[8px] text-black/50 opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
            title={isRtl ? 'إغلاق' : 'Close'}
          />
          <span
            className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-flex items-center justify-center text-[8px] text-black/50 opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
            title={isRtl ? 'تصغير' : 'Minimize'}
          />
          <span
            className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-flex items-center justify-center text-[8px] text-black/50 opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
            title={isRtl ? 'تكبير' : 'Zoom'}
          />
        </div>

        {/* App Title & Version badge */}
        <div className="flex items-center gap-2 mr-3 ml-1">
          <span className="font-semibold text-sm tracking-tight text-ui-fg">MailHub</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-ui-accent-soft text-ui-accent border border-ui-border">
            M1+ ARM64
          </span>
        </div>
      </div>

      {/* Center: Search Trigger (⌘K) */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={openSearchModal}
          className="w-full flex items-center justify-between px-3 py-1 text-xs rounded-md bg-ui-panel border border-ui-border text-ui-fg-muted hover:border-ui-accent hover:text-ui-fg transition-all shadow-sm"
          title={isRtl ? 'بحث في الرسائل المفهرسة (⌘K)' : 'Search indexed messages (⌘K)'}
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>{isRtl ? 'بحث في الرسائل المفهرسة محليًا...' : 'Search local indexed mail...'}</span>
          </div>
          <kbd className="font-mono text-[10px] bg-ui-bg px-1.5 py-0.5 rounded border border-ui-border text-ui-fg-muted">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions & Settings */}
      <div className="flex items-center gap-1.5">
        {/* Sync Trigger */}
        <button
          onClick={triggerSyncAll}
          disabled={isSyncingAll}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-ui-panel border border-ui-border text-ui-fg hover:bg-ui-accent-soft hover:text-ui-accent transition-colors disabled:opacity-50"
          title={isRtl ? 'مزامنة كافة الحسابات (⌘R)' : 'Sync all accounts (⌘R)'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin text-ui-accent' : ''}`} />
          <span className="hidden sm:inline">
            {isSyncingAll
              ? isRtl ? 'جارٍ المزامنة...' : 'Syncing...'
              : isRtl ? 'مزامنة' : 'Sync'}
          </span>
        </button>

        {/* Compose Button */}
        <button
          onClick={() => openCompose()}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-ui-accent text-ui-fg-on-accent hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
          title={isRtl ? 'إنشاء رسالة جديدة (⌘N)' : 'Compose new message (⌘N)'}
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>{isRtl ? 'رسالة جديدة' : 'Compose'}</span>
        </button>

        <div className="h-4 w-[1px] bg-ui-border mx-1" />

        {/* Accounts Manager trigger */}
        <button
          onClick={openAccountManager}
          className="relative p-1.5 text-ui-fg-muted hover:text-ui-fg hover:bg-ui-panel rounded-md transition-colors"
          title={isRtl ? 'إدارة الحسابات والمزودين' : 'Manage Accounts & Providers'}
        >
          <Users className="w-4 h-4" />
          {accountsNeedingAttention > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-ui-danger" />
          )}
        </button>

        {/* Language Toggle (Arabic / English) */}
        <button
          onClick={() => setLanguage(settings.language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1 p-1.5 text-ui-fg-muted hover:text-ui-fg hover:bg-ui-panel rounded-md text-xs font-medium transition-colors"
          title={isRtl ? 'Switch to English' : 'التبديل إلى العربية'}
        >
          <Globe className="w-4 h-4" />
          <span className="text-[11px] font-bold">{settings.language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 text-ui-fg-muted hover:text-ui-fg hover:bg-ui-panel rounded-md transition-colors"
          title={
            settings.theme === 'dark'
              ? isRtl ? 'الوضع الفاتح' : 'Light Mode'
              : isRtl ? 'الوضع الداكن' : 'Dark Mode'
          }
        >
          {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Settings */}
        <button
          onClick={openSettings}
          className="p-1.5 text-ui-fg-muted hover:text-ui-fg hover:bg-ui-panel rounded-md transition-colors"
          title={isRtl ? 'الإعدادات (⌘,)' : 'Settings (⌘,)'}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
