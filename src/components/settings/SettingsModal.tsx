import React, { useState } from 'react';
import { useMailStore } from '../../store/mailStore';
import {
  X,
  Sliders,
  Shield,
  Trash2,
  Cpu,
} from 'lucide-react';
import { DensityMode, ThemeMode } from '../../types/mail';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    settings,
    setTheme,
    setLanguage,
    setDensity,
    updateSettings,
    clearCache,
    messages,
  } = useMailStore();

  const isRtl = settings.language === 'ar';
  const [activeTab, setActiveTab] = useState<
    'general' | 'sync' | 'storage' | 'privacy' | 'shortcuts' | 'about'
  >('general');

  if (!isSettingsOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isRtl ? 'إعدادات التطبيق' : 'Preferences'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none"
    >
      <div className="w-[660px] max-w-full h-[540px] max-h-[90vh] rounded-lg border border-ui-border bg-ui-panel shadow-mac-modal flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-11 px-4 bg-ui-bg border-b border-ui-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-ui-accent" />
            <h2 className="font-semibold text-xs text-ui-fg">
              {isRtl ? 'تفضيلات MailHub (⌘,)' : 'MailHub Preferences (⌘,)'}
            </h2>
          </div>

          <button
            onClick={closeSettings}
            className="p-1 rounded hover:bg-ui-panel text-ui-fg-muted hover:text-ui-fg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-4 border-b border-ui-border bg-ui-bg/40 flex items-center gap-4 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'general'
                ? 'border-ui-accent text-ui-accent font-semibold'
                : 'border-transparent text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            {isRtl ? 'عام والمظهر' : 'General & UI'}
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'sync'
                ? 'border-ui-accent text-ui-accent font-semibold'
                : 'border-transparent text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            {isRtl ? 'المزامنة والشبكة' : 'Sync & Limits'}
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'storage'
                ? 'border-ui-accent text-ui-accent font-semibold'
                : 'border-transparent text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            {isRtl ? 'التخزين والذاكرة' : 'Storage & Cache'}
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'privacy'
                ? 'border-ui-accent text-ui-accent font-semibold'
                : 'border-transparent text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            {isRtl ? 'الخصوصية والأمان' : 'Privacy & Security'}
          </button>

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'shortcuts'
                ? 'border-ui-accent text-ui-accent font-semibold'
                : 'border-transparent text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            {isRtl ? 'اختصارات Mac' : 'Shortcuts'}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'about'
                ? 'border-ui-accent text-ui-accent font-semibold'
                : 'border-transparent text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            {isRtl ? 'حول النظام' : 'About'}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-5 select-text">
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Theme Mode */}
              <div className="space-y-1.5">
                <label className="font-semibold text-ui-fg">
                  {isRtl ? 'مظهر الواجهة (Theme):' : 'Appearance:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTheme(mode)}
                      className={`p-2 rounded-md border text-center font-medium capitalize transition-all ${
                        settings.theme === mode
                          ? 'border-ui-accent bg-ui-accent-soft text-ui-accent font-bold'
                          : 'border-ui-border bg-ui-panel hover:border-ui-fg-muted text-ui-fg'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language / Direction */}
              <div className="space-y-1.5">
                <label className="font-semibold text-ui-fg">
                  {isRtl ? 'اللغة واتجاه الواجهة:' : 'Language & Direction:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLanguage('ar')}
                    className={`p-2 rounded-md border text-center font-medium transition-all ${
                      settings.language === 'ar'
                        ? 'border-ui-accent bg-ui-accent-soft text-ui-accent font-bold'
                        : 'border-ui-border bg-ui-panel hover:border-ui-fg-muted text-ui-fg'
                    }`}
                  >
                    العربية (RTL)
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`p-2 rounded-md border text-center font-medium transition-all ${
                      settings.language === 'en'
                        ? 'border-ui-accent bg-ui-accent-soft text-ui-accent font-bold'
                        : 'border-ui-border bg-ui-panel hover:border-ui-fg-muted text-ui-fg'
                    }`}
                  >
                    English (LTR)
                  </button>
                </div>
              </div>

              {/* Density */}
              <div className="space-y-1.5">
                <label className="font-semibold text-ui-fg">
                  {isRtl ? 'كثافة عرض قائمة الرسائل:' : 'Message List Density:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'default', 'comfortable'] as DensityMode[]).map((density) => (
                    <button
                      key={density}
                      onClick={() => setDensity(density)}
                      className={`p-2 rounded-md border text-center font-medium capitalize transition-all ${
                        settings.density === density
                          ? 'border-ui-accent bg-ui-accent-soft text-ui-accent font-bold'
                          : 'border-ui-border bg-ui-panel hover:border-ui-fg-muted text-ui-fg'
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-ui-border bg-ui-bg/40 space-y-1">
                <h4 className="font-semibold text-ui-fg">
                  {isRtl ? 'سياسة المزامنة العادلة والمحدودة (Fair Bounded Sync)' : 'Bounded Sync Scheduling'}
                </h4>
                <p className="text-[11px] text-ui-fg-muted leading-relaxed">
                  {isRtl
                    ? 'يمنع MailHub استنزاف منافذ الشبكة والاتصالات الدائمة لكل حساب. تتم المزامنة ضمن جدول زمني محكوم مع مراعاة قيود مزودي البريد (Rate Limits).'
                    : 'MailHub does not open unbounded sockets. Sync runs on a fair queue respecting provider rate limits.'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-ui-fg block">
                  {isRtl ? 'الحد الأقصى للمزامنات المتزامنة (Global Concurrency):' : 'Max Concurrent Account Syncs:'}
                </label>
                <select
                  value={settings.globalParallelSyncs}
                  onChange={(e) => updateSettings({ globalParallelSyncs: Number(e.target.value) })}
                  className="w-full bg-ui-bg border border-ui-border rounded px-3 py-1.5 text-xs text-ui-fg focus:outline-none"
                >
                  <option value={2}>2 accounts (Low Power Mode)</option>
                  <option value={4}>4 accounts (Recommended for Apple Silicon M1+)</option>
                  <option value={8}>8 accounts (Fast broadband)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-ui-fg block">
                  {isRtl ? 'فترة التحديث الدوري التلقائي:' : 'Background Poll Interval:'}
                </label>
                <select
                  value={settings.syncIntervalMinutes}
                  onChange={(e) => updateSettings({ syncIntervalMinutes: Number(e.target.value) })}
                  className="w-full bg-ui-bg border border-ui-border rounded px-3 py-1.5 text-xs text-ui-fg focus:outline-none"
                >
                  <option value={5}>Every 5 minutes</option>
                  <option value={10}>Every 10 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-ui-fg block">
                  {isRtl ? 'عمق المزامنة الأولية لكل حساب:' : 'Initial Sync History Depth:'}
                </label>
                <select
                  value={settings.initialSyncDays}
                  onChange={(e) => updateSettings({ initialSyncDays: Number(e.target.value) })}
                  className="w-full bg-ui-bg border border-ui-border rounded px-3 py-1.5 text-xs text-ui-fg focus:outline-none"
                >
                  <option value={30}>Last 30 days / 200 messages (Fastest, saves disk)</option>
                  <option value={90}>Last 90 days</option>
                  <option value={365}>Full Year</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-ui-border bg-ui-bg/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ui-fg">{isRtl ? 'قاعدة بيانات SQLite المحلية:' : 'Local SQLite Database:'}</span>
                  <span className="font-mono text-ui-fg">{(messages.length * 0.08 + 4.2).toFixed(1)} MB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ui-fg">{isRtl ? 'مرفقات الذاكرة المؤقتة:' : 'Cached Attachments:'}</span>
                  <span className="font-mono text-ui-fg">3.9 MB</span>
                </div>
                <div className="flex items-center justify-between text-ui-fg-muted text-[11px]">
                  <span>{isRtl ? 'حد الذاكرة المحلي المسموح:' : 'Allocated Cache Limit:'}</span>
                  <span className="font-mono">{settings.cacheLimitMb} MB</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => clearCache('bodies')}
                  className="w-full p-2.5 rounded border border-ui-border bg-ui-panel hover:bg-ui-bg text-start flex items-center justify-between text-xs text-ui-fg"
                >
                  <div>
                    <div className="font-medium">{isRtl ? 'مسح نصوص الرسائل المؤقتة' : 'Clear Cached Message Bodies'}</div>
                    <div className="text-[10px] text-ui-fg-muted">
                      {isRtl
                        ? 'يحتفظ بالعناوين والفهارس ويعيد جلب النصوص عند فتح الرسالة.'
                        : 'Keeps headers and index, fetches body on-demand.'}
                    </div>
                  </div>
                  <Trash2 className="w-3.5 h-3.5 text-ui-fg-muted" />
                </button>

                <button
                  type="button"
                  onClick={() => clearCache('attachments')}
                  className="w-full p-2.5 rounded border border-ui-border bg-ui-panel hover:bg-ui-bg text-start flex items-center justify-between text-xs text-ui-fg"
                >
                  <div>
                    <div className="font-medium">{isRtl ? 'مسح المرفقات المنزلة محليًا' : 'Clear Downloaded Attachments'}</div>
                    <div className="text-[10px] text-ui-fg-muted">
                      {isRtl
                        ? 'تفريغ مساحة القرص دون حذف الملفات من خوادم البريد.'
                        : 'Frees local disk space without deleting files from server.'}
                    </div>
                  </div>
                  <Trash2 className="w-3.5 h-3.5 text-ui-fg-muted" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-ui-border bg-ui-bg/40 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-ui-fg">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>{isRtl ? 'حماية بيانات الاعتماد والخصوصية' : 'Credential & Privacy Isolation'}</span>
                </div>
                <p className="text-[11px] text-ui-fg-muted leading-relaxed">
                  {isRtl
                    ? 'رموز OAuth وكلمات المرور لا تُحفظ أبدًا في متصفح الويب أو ملفات SQLite أو سجلات النظام، بل تودع حصرًا في macOS Keychain.'
                    : 'Tokens and secrets are kept in macOS Keychain. Untrusted mail HTML is sanitized and isolated from Tauri IPC.'}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border border-ui-border bg-ui-panel">
                <div>
                  <div className="font-semibold text-ui-fg">
                    {isRtl ? 'حظر الصور البعيدة افتراضيًا' : 'Block Remote Images by Default'}
                  </div>
                  <div className="text-[11px] text-ui-fg-muted">
                    {isRtl
                      ? 'يمنع وحدات البكسل التتبعية (Tracking pixels) حتى يوافق المستخدم.'
                      : 'Prevents tracking pixels until explicit user approval.'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.blockRemoteImages}
                  onChange={(e) => updateSettings({ blockRemoteImages: e.target.checked })}
                  className="w-4 h-4 accent-ui-accent"
                />
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-ui-fg">
                {isRtl ? 'اختصارات لوحة المفاتيح في macOS' : 'Standard macOS Shortcuts'}
              </h4>
              <div className="divide-y divide-ui-border/60 border border-ui-border rounded-lg bg-ui-panel overflow-hidden">
                {[
                  { key: '⌘K / Ctrl+K', descAr: 'البحث الشامل في الرسائل المفهرسة', descEn: 'Global Search' },
                  { key: '⌘N / Ctrl+N', descAr: 'إنشاء رسالة جديدة', descEn: 'Compose new message' },
                  { key: '⌘R / Ctrl+R', descAr: 'مزامنة الحسابات أو الرد على الرسالة', descEn: 'Sync accounts / Reply' },
                  { key: '⌘, / Ctrl+,', descAr: 'فتح شاشة الإعدادات', descEn: 'Open Preferences' },
                  { key: 'J / ↓', descAr: 'الانتقال إلى الرسالة التالية', descEn: 'Next message' },
                  { key: 'K / ↑', descAr: 'الانتقال إلى الرسالة السابقة', descEn: 'Previous message' },
                  { key: 'E', descAr: 'أرشفة الرسالة المحددة', descEn: 'Archive selected message' },
                  { key: 'Backspace / Delete', descAr: 'نقل الرسالة إلى سلة المهملات', descEn: 'Delete message' },
                  { key: 'S', descAr: 'تمييز أو إلغاء تمييز الرسالة بنجمة', descEn: 'Toggle Star' },
                  { key: 'U', descAr: 'تغيير حالة القراءة (مقروءة / غير مقروءة)', descEn: 'Toggle Unread' },
                ].map((item, i) => (
                  <div key={i} className="px-3 py-2 flex items-center justify-between text-xs">
                    <span className="text-ui-fg">{isRtl ? item.descAr : item.descEn}</span>
                    <kbd className="font-mono text-[11px] bg-ui-bg px-2 py-0.5 rounded border border-ui-border text-ui-fg font-semibold">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-xl bg-ui-accent flex items-center justify-center text-white mx-auto shadow-md">
                <Cpu className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-bold text-base text-ui-fg">MailHub Desktop</h3>
                <p className="text-xs text-ui-fg-muted font-mono mt-0.5">Version 0.1.0-alpha (Build 2026.10)</p>
              </div>

              <div className="max-w-md mx-auto p-3 rounded-lg border border-ui-border bg-ui-bg/50 text-[11px] text-ui-fg-muted space-y-1">
                <div>Architecture: <strong>Apple Silicon ARM64 (aarch64-apple-darwin)</strong></div>
                <div>Engine: <strong>Tauri 2 + Rust Tokio + SQLite FTS5</strong></div>
                <div>UI Stack: <strong>React 18 + TypeScript + Vite + Tailwind CSS</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
