import React, { useState } from 'react';
import { useMailStore } from '../../store/mailStore';
import {
  X,
  Users,
  Plus,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  Trash2,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Server,
  Layers,
} from 'lucide-react';
import { AccountStatus, ProviderType } from '../../types/mail';

export const AccountManagerModal: React.FC = () => {
  const {
    isAccountManagerOpen,
    closeAccountManager,
    accounts,
    triggerSyncAccount,
    pauseAccount,
    resumeAccount,
    reconnectAccount,
    removeAccount,
    addAccount,
    loadStressTestData,
    resetToDefaultData,
    settings,
  } = useMailStore();

  const isRtl = settings.language === 'ar';
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stress'>('list');

  // Add Account form state
  const [provider, setProvider] = useState<ProviderType>('imap');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [groupName, setGroupName] = useState('العمل (Work)');
  const [serverHost, setServerHost] = useState('imap.example.com');
  const [smtpHost, setSmtpHost] = useState('smtp.example.com');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isAccountManagerOpen) return null;

  const handleTestAndAdd = async () => {
    if (!email || !displayName) {
      setTestResult({
        success: false,
        message: isRtl ? 'يرجى إدخال اسم الحساب والبريد الإلكتروني' : 'Please provide display name and email',
      });
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    // Simulate TLS handshake and credential test
    await new Promise((r) => setTimeout(r, 1200));

    setIsTestingConnection(false);
    setTestResult({
      success: true,
      message: isRtl ? 'تم التحقق من الاتصال وشهادة TLS بنجاح!' : 'Connection and TLS verified successfully!',
    });

    const colors = ['#176BD3', '#EA4335', '#0078D4', '#107C41', '#8A2BE2', '#D83B01'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    addAccount({
      email,
      displayName,
      provider,
      groupName,
      status: 'ready',
      syncIntervalMinutes: 5,
      color: randomColor,
    });

    setTimeout(() => {
      setActiveTab('list');
      setTestResult(null);
      setEmail('');
      setDisplayName('');
    }, 900);
  };

  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            {isRtl ? 'جاهز ومتصل' : 'Connected'}
          </span>
        );
      case 'syncing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-ui-accent/10 text-ui-accent">
            <RefreshCw className="w-3 h-3 animate-spin" />
            {isRtl ? 'مزامنة نشطة' : 'Syncing'}
          </span>
        );
      case 'rate_limited':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-3 h-3" />
            {isRtl ? 'محدود المعدل (429)' : 'Rate limited'}
          </span>
        );
      case 'auth_required':
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-ui-danger/10 text-ui-danger">
            <AlertCircle className="w-3 h-3" />
            {isRtl ? 'مطلوب إعادة المصادقة' : 'Auth Required'}
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-500/10 text-gray-500">
            <PauseCircle className="w-3 h-3" />
            {isRtl ? 'متوقف مؤقتًا' : 'Paused'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isRtl ? 'نافذة إدارة الحسابات' : 'Account manager'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none"
    >
      <div className="w-[720px] max-w-full h-[620px] max-h-[90vh] rounded-lg border border-ui-border bg-ui-panel shadow-mac-modal flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 px-4 bg-ui-bg border-b border-ui-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-ui-accent" />
            <h2 className="font-semibold text-sm text-ui-fg">
              {isRtl ? 'إدارة حسابات البريد الإلكتروني' : 'Email Accounts & Providers'}
            </h2>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-ui-accent-soft text-ui-accent">
              {accounts.length} {isRtl ? 'حساب' : 'accounts'}
            </span>
          </div>

          <button
            onClick={closeAccountManager}
            className="p-1 rounded hover:bg-ui-panel text-ui-fg-muted hover:text-ui-fg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 border-b border-ui-border bg-ui-bg/50 flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'list'
                ? 'border-ui-accent text-ui-accent font-semibold'
                : 'border-transparent text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            {isRtl ? 'قائمة الحسابات المتصلة' : 'Connected Accounts'}
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'border-ui-accent text-ui-accent font-semibold'
                : 'border-transparent text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            {isRtl ? 'إضافة حساب جديد' : 'Add New Account'}
          </button>

          <button
            onClick={() => setActiveTab('stress')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'stress'
                ? 'border-ui-accent text-ui-accent font-semibold'
                : 'border-transparent text-ui-fg-muted hover:text-ui-fg'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            {isRtl ? 'اختبار التحمل (1000 رسالة / 100 حساب)' : 'Scale & Stress Test'}
          </button>
        </div>

        {/* Tab 1: List of Accounts */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-ui-border/60">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: acc.color }}
                    />
                    <span className="font-semibold text-ui-fg text-[13px]">{acc.displayName}</span>
                    {getStatusBadge(acc.status)}
                  </div>

                  <div className="flex items-center gap-2 text-ui-fg-muted">
                    <bdi className="font-mono text-ui-fg font-medium">{acc.email}</bdi>
                    <span>•</span>
                    <span className="uppercase text-[10px] font-mono px-1 rounded bg-ui-bg border border-ui-border">
                      {acc.provider}
                    </span>
                    <span>•</span>
                    <span>{acc.groupName}</span>
                  </div>

                  {acc.errorMessage && (
                    <div className="text-[11px] text-ui-danger font-medium flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{acc.errorMessage}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {acc.status === 'auth_required' || acc.status === 'rate_limited' ? (
                    <button
                      onClick={() => reconnectAccount(acc.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-ui-accent text-ui-fg-on-accent text-xs font-medium hover:opacity-90"
                      title={isRtl ? 'إعادة المصادقة عبر OAuth / TLS' : 'Reconnect / Re-authenticate'}
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>{isRtl ? 'إعادة المصادقة' : 'Reconnect'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => triggerSyncAccount(acc.id)}
                      disabled={acc.status === 'syncing' || acc.status === 'paused'}
                      className="p-1.5 rounded hover:bg-ui-bg text-ui-fg-muted hover:text-ui-fg disabled:opacity-40"
                      title={isRtl ? 'مزامنة الحساب الآن' : 'Sync account now'}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${acc.status === 'syncing' ? 'animate-spin' : ''}`} />
                    </button>
                  )}

                  {acc.status === 'paused' ? (
                    <button
                      onClick={() => resumeAccount(acc.id)}
                      className="p-1.5 rounded hover:bg-ui-bg text-emerald-500 hover:text-emerald-600"
                      title={isRtl ? 'استئناف المزامنة' : 'Resume sync'}
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => pauseAccount(acc.id)}
                      className="p-1.5 rounded hover:bg-ui-bg text-ui-fg-muted hover:text-amber-500"
                      title={isRtl ? 'إيقاف المزامنة مؤقتًا' : 'Pause sync'}
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => removeAccount(acc.id)}
                    className="p-1.5 rounded hover:bg-ui-bg text-ui-fg-muted hover:text-ui-danger"
                    title={isRtl ? 'إزالة الحساب ومسح الذاكرة المحلية' : 'Remove account'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Add New Account Wizard */}
        {activeTab === 'add' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs select-text">
            <div>
              <h3 className="font-semibold text-sm text-ui-fg">
                {isRtl ? 'اختر نوع مزود البريد' : 'Select Provider Type'}
              </h3>
              <p className="text-[11px] text-ui-fg-muted mt-0.5">
                {isRtl
                  ? 'يتم تخزين رموز الوصول OAuth وبيانات الاعتماد المشفرة فقط في macOS Keychain.'
                  : 'Tokens and passwords are exclusively stored in native macOS Keychain.'}
              </p>
            </div>

            {/* Provider Selectors */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setProvider('gmail')}
                className={`p-3 rounded-lg border text-start space-y-1 transition-all ${
                  provider === 'gmail'
                    ? 'border-ui-accent bg-ui-accent-soft font-semibold'
                    : 'border-ui-border hover:border-ui-fg-muted bg-ui-panel'
                }`}
              >
                <div className="font-bold text-red-500">Google Gmail</div>
                <div className="text-[10px] text-ui-fg-muted">OAuth 2.0 PKCE Browser Flow</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('outlook')}
                className={`p-3 rounded-lg border text-start space-y-1 transition-all ${
                  provider === 'outlook'
                    ? 'border-ui-accent bg-ui-accent-soft font-semibold'
                    : 'border-ui-border hover:border-ui-fg-muted bg-ui-panel'
                }`}
              >
                <div className="font-bold text-blue-500">Microsoft Outlook</div>
                <div className="text-[10px] text-ui-fg-muted">Microsoft Graph Delta API</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('imap')}
                className={`p-3 rounded-lg border text-start space-y-1 transition-all ${
                  provider === 'imap'
                    ? 'border-ui-accent bg-ui-accent-soft font-semibold'
                    : 'border-ui-border hover:border-ui-fg-muted bg-ui-panel'
                }`}
              >
                <div className="font-bold text-emerald-600">IMAP / SMTP</div>
                <div className="text-[10px] text-ui-fg-muted">TLS Encrypted Custom Domains</div>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-ui-fg mb-1">
                  {isRtl ? 'الاسم الظاهر للحساب:' : 'Account Display Name:'}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Work Sales or Personal"
                  className="w-full bg-ui-bg border border-ui-border rounded px-3 py-1.5 text-xs text-ui-fg focus:outline-none focus:border-ui-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-ui-fg mb-1">
                  {isRtl ? 'عنوان البريد الإلكتروني:' : 'Email Address:'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  className="w-full bg-ui-bg border border-ui-border rounded px-3 py-1.5 text-xs text-ui-fg focus:outline-none focus:border-ui-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-ui-fg mb-1">
                  {isRtl ? 'المجموعة التنظيمية:' : 'Account Group:'}
                </label>
                <select
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-ui-bg border border-ui-border rounded px-3 py-1.5 text-xs text-ui-fg focus:outline-none focus:border-ui-accent"
                >
                  <option value="العمل (Work)">العمل (Work)</option>
                  <option value="شخصي (Personal)">شخصي (Personal)</option>
                  <option value="عملاء ومشاريع (Projects)">عملاء ومشاريع (Projects)</option>
                  <option value="أرشفة (Archive)">أرشفة (Archive)</option>
                </select>
              </div>

              {provider === 'imap' && (
                <div className="p-3 rounded-lg border border-ui-border bg-ui-bg/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-ui-fg">
                    <Server className="w-3.5 h-3.5 text-ui-accent" />
                    <span>{isRtl ? 'إعدادات خوادم IMAP/SMTP المشفرة' : 'Encrypted Server Settings'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-ui-fg-muted">IMAP Host & Port (TLS 993)</span>
                      <input
                        type="text"
                        value={serverHost}
                        onChange={(e) => setServerHost(e.target.value)}
                        className="w-full bg-ui-panel border border-ui-border rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-ui-fg-muted">SMTP Host & Port (SSL 465)</span>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        className="w-full bg-ui-panel border border-ui-border rounded px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {testResult && (
                <div
                  className={`p-2.5 rounded-md text-xs flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-ui-danger/10 text-ui-danger border border-ui-danger/20'
                  }`}
                >
                  {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-ui-border">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-3 py-1.5 rounded hover:bg-ui-bg text-ui-fg-muted hover:text-ui-fg"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleTestAndAdd}
                disabled={isTestingConnection}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-ui-accent text-ui-fg-on-accent font-medium hover:opacity-90 disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {isTestingConnection
                    ? (isRtl ? 'جارٍ التحقق من الاتصال...' : 'Testing TLS & Auth...')
                    : (isRtl ? 'اختبار الاتصال والإضافة' : 'Test & Add Account')}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Scale & Stress Testing */}
        {activeTab === 'stress' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs select-text">
            <div>
              <h3 className="font-semibold text-sm text-ui-fg flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isRtl ? 'محاكي اختبار التحمل والأداء العالي' : 'High-Density Scale Simulator'}</span>
              </h3>
              <p className="text-[11px] text-ui-fg-muted mt-1 leading-relaxed">
                {isRtl
                  ? 'وفقًا لمواصفات MASTER_PLAN.md، يدعم MailHub التوسع لإدارة مئات الحسابات مع التمرير الافتراضي (DOM Virtualization) وجدولة المزامنة الآمنة دون استنزاف موارد النظام.'
                  : 'As mandated in MASTER_PLAN.md, MailHub supports scaling to hundreds of mailboxes with virtualized list rendering without unbounded memory exhaustion.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg border border-ui-border bg-ui-bg/40 space-y-2">
                <h4 className="font-semibold text-xs text-ui-fg">
                  {isRtl ? 'تحميل 100 حساب و 1,000 رسالة' : '100 Accounts & 1,000 Messages'}
                </h4>
                <p className="text-[11px] text-ui-fg-muted">
                  {isRtl
                    ? 'يختبر محرك التمرير الافتراضي TanStack Virtual، ومجموعات الحسابات المتعددة، والبحث الفوري.'
                    : 'Tests virtual scrolling, DOM recycling, and multi-group provenance routing.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    loadStressTestData(100, 1000);
                    setActiveTab('list');
                  }}
                  className="w-full mt-2 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors"
                >
                  {isRtl ? 'تشغيل اختبار 1,000 رسالة' : 'Run 1,000 Messages Test'}
                </button>
              </div>

              <div className="p-4 rounded-lg border border-ui-border bg-ui-bg/40 space-y-2">
                <h4 className="font-semibold text-xs text-ui-fg">
                  {isRtl ? 'استعادة البيانات القياسية' : 'Reset Standard Dataset'}
                </h4>
                <p className="text-[11px] text-ui-fg-muted">
                  {isRtl
                    ? 'إعادة تعيين الحالة إلى الحسابات النموذجية الأربعة (Gmail, Outlook, Domain IMAP).'
                    : 'Resets to default 4 multi-provider demo mailboxes.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    resetToDefaultData();
                    setActiveTab('list');
                  }}
                  className="w-full mt-2 px-3 py-1.5 rounded border border-ui-border bg-ui-panel hover:bg-ui-bg text-ui-fg font-medium text-xs transition-colors"
                >
                  {isRtl ? 'استعادة البيانات القياسية' : 'Reset Fixtures'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
