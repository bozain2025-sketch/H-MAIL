import { create } from 'zustand';
import {
  Account,
  DensityMode,
  LanguageMode,
  Message,
  ThemeMode,
  ToastMessage,
  UserSettings,
} from '../types/mail';
import {
  INITIAL_ACCOUNTS,
  INITIAL_MESSAGES,
  generateSyntheticAccounts,
  generateSyntheticMessages,
} from '../fixtures/mockData';

export type ActiveView =
  | 'unified_inbox'
  | 'starred'
  | 'drafts'
  | 'sent'
  | 'archive'
  | 'account'
  | 'group';

interface ComposeDraft {
  fromAccountId: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  attachments: { name: string; size: number }[];
  isReplyingToId?: string;
}

interface MailState {
  accounts: Account[];
  messages: Message[];
  activeView: ActiveView;
  selectedAccountId: string | null;
  selectedGroupName: string | null;
  selectedMessageId: string | null;

  // Search & Filter
  searchQuery: string;
  filterUnreadOnly: boolean;
  filterStarredOnly: boolean;
  filterHasAttachment: boolean;
  filterAccountId: string | null;

  // UI Modals
  isComposeOpen: boolean;
  composeDraft: ComposeDraft;
  isAccountManagerOpen: boolean;
  isSettingsOpen: boolean;
  isSearchModalOpen: boolean;
  isSyncingAll: boolean;
  isDemoMode: boolean;

  // Security / Images
  remoteImagesAllowed: Set<string>;

  // Settings
  settings: UserSettings;

  // Feedback & Undo
  toast: ToastMessage | null;
  undoStack: (() => void)[];

  // Actions
  setActiveView: (view: ActiveView, accountId?: string | null, groupName?: string | null) => void;
  selectMessage: (id: string | null) => void;
  toggleRead: (id: string) => void;
  toggleStarred: (id: string) => void;
  archiveMessage: (id: string) => void;
  deleteMessage: (id: string) => void;
  sendMessage: (draft: ComposeDraft) => Promise<boolean>;

  // Sync actions
  triggerSyncAccount: (accountId: string) => void;
  triggerSyncAll: () => void;

  // Account Management
  addAccount: (account: Omit<Account, 'id' | 'unreadCount' | 'totalCount' | 'lastSyncAt'>) => void;
  removeAccount: (accountId: string) => void;
  pauseAccount: (accountId: string) => void;
  resumeAccount: (accountId: string) => void;
  reconnectAccount: (accountId: string) => void;

  // Security
  allowRemoteImagesForMessage: (messageId: string) => void;

  // Preferences
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: LanguageMode) => void;
  setDensity: (density: DensityMode) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Modals
  openCompose: (initial?: Partial<ComposeDraft>) => void;
  closeCompose: () => void;
  updateComposeDraft: (updates: Partial<ComposeDraft>) => void;
  openAccountManager: () => void;
  closeAccountManager: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;

  // Filters
  setSearchQuery: (query: string) => void;
  setFilterUnreadOnly: (value: boolean) => void;
  setFilterStarredOnly: (value: boolean) => void;
  setFilterHasAttachment: (value: boolean) => void;
  setFilterAccountId: (accountId: string | null) => void;

  // Stress testing
  loadStressTestData: (accountsCount: number, messagesCount: number) => void;
  resetToDefaultData: () => void;

  // Cache management
  clearCache: (type: 'bodies' | 'attachments' | 'all') => void;

  // Feedback
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: () => void;
  triggerUndo: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  language: 'ar',
  density: 'default',
  syncIntervalMinutes: 5,
  globalParallelSyncs: 4,
  initialSyncDays: 30,
  blockRemoteImages: true,
  cacheLimitMb: 1024,
};

export const useMailStore = create<MailState>((set, get) => ({
  accounts: INITIAL_ACCOUNTS,
  messages: INITIAL_MESSAGES,
  activeView: 'unified_inbox',
  selectedAccountId: null,
  selectedGroupName: null,
  selectedMessageId: INITIAL_MESSAGES[0]?.id || null,

  searchQuery: '',
  filterUnreadOnly: false,
  filterStarredOnly: false,
  filterHasAttachment: false,
  filterAccountId: null,

  isComposeOpen: false,
  composeDraft: {
    fromAccountId: INITIAL_ACCOUNTS[0]?.id || '',
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: [],
  },
  isAccountManagerOpen: false,
  isSettingsOpen: false,
  isSearchModalOpen: false,
  isSyncingAll: false,
  isDemoMode: true,

  remoteImagesAllowed: new Set<string>(),

  settings: DEFAULT_SETTINGS,

  toast: null,
  undoStack: [],

  setActiveView: (view, accountId = null, groupName = null) => {
    set({
      activeView: view,
      selectedAccountId: accountId,
      selectedGroupName: groupName,
      // If switching view, select first visible message if current is not in view
      searchQuery: '',
    });
  },

  selectMessage: (id) => {
    set({ selectedMessageId: id });
    if (id) {
      // Mark as read when selected
      const { messages, accounts } = get();
      const msg = messages.find((m) => m.id === id);
      if (msg && !msg.isRead) {
        set({
          messages: messages.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
          accounts: accounts.map((acc) =>
            acc.id === msg.accountId
              ? { ...acc, unreadCount: Math.max(0, acc.unreadCount - 1) }
              : acc
          ),
        });
      }
    }
  },

  toggleRead: (id) => {
    const { messages, accounts } = get();
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    const newRead = !msg.isRead;
    set({
      messages: messages.map((m) => (m.id === id ? { ...m, isRead: newRead } : m)),
      accounts: accounts.map((acc) =>
        acc.id === msg.accountId
          ? {
              ...acc,
              unreadCount: newRead
                ? Math.max(0, acc.unreadCount - 1)
                : acc.unreadCount + 1,
            }
          : acc
      ),
    });
  },

  toggleStarred: (id) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, isStarred: !m.isStarred } : m
      ),
    }));
  },

  archiveMessage: (id) => {
    const { messages, selectedMessageId } = get();
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    const originalFolder = msg.folderId;
    const newMessages = messages.map((m) =>
      m.id === id ? { ...m, folderId: 'archive' } : m
    );

    // Pick next message if the archived one was selected
    let nextSelectedId = selectedMessageId;
    if (selectedMessageId === id) {
      const idx = messages.findIndex((m) => m.id === id);
      const remaining = newMessages.filter((m) => m.folderId === originalFolder);
      nextSelectedId = remaining[idx]?.id || remaining[0]?.id || null;
    }

    // Undo action
    const undo = () => {
      set((s) => ({
        messages: s.messages.map((m) => (m.id === id ? { ...m, folderId: originalFolder } : m)),
        selectedMessageId: id,
      }));
      get().showToast({
        text: get().settings.language === 'ar' ? 'تم التراجع عن الأرشفة' : 'Archiving undone',
        type: 'info',
      });
    };

    set((state) => ({
      messages: newMessages,
      selectedMessageId: nextSelectedId,
      undoStack: [...state.undoStack, undo],
    }));

    get().showToast({
      text: get().settings.language === 'ar' ? 'تمت أرشفة الرسالة' : 'Message archived',
      actionLabel: get().settings.language === 'ar' ? 'تراجع' : 'Undo',
      onAction: undo,
      type: 'info',
    });
  },

  deleteMessage: (id) => {
    const { messages, selectedMessageId } = get();
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    const originalFolder = msg.folderId;
    const newMessages = messages.map((m) =>
      m.id === id ? { ...m, folderId: 'trash' } : m
    );

    let nextSelectedId = selectedMessageId;
    if (selectedMessageId === id) {
      const idx = messages.findIndex((m) => m.id === id);
      const remaining = newMessages.filter((m) => m.folderId === originalFolder);
      nextSelectedId = remaining[idx]?.id || remaining[0]?.id || null;
    }

    const undo = () => {
      set((s) => ({
        messages: s.messages.map((m) => (m.id === id ? { ...m, folderId: originalFolder } : m)),
        selectedMessageId: id,
      }));
      get().showToast({
        text: get().settings.language === 'ar' ? 'تم التراجع عن الحذف' : 'Deletion undone',
        type: 'info',
      });
    };

    set((state) => ({
      messages: newMessages,
      selectedMessageId: nextSelectedId,
      undoStack: [...state.undoStack, undo],
    }));

    get().showToast({
      text: get().settings.language === 'ar' ? 'تم نقل الرسالة إلى سلة المهملات' : 'Moved to Trash',
      actionLabel: get().settings.language === 'ar' ? 'تراجع' : 'Undo',
      onAction: undo,
      type: 'warning',
    });
  },

  sendMessage: async (draft) => {
    const { accounts, settings } = get();
    const sendingAccount = accounts.find((a) => a.id === draft.fromAccountId);
    if (!sendingAccount) return false;

    // Simulate sending with latency
    await new Promise((r) => setTimeout(r, 600));

    const newMessage: Message = {
      id: `sent-${Date.now()}`,
      accountId: sendingAccount.id,
      accountEmail: sendingAccount.email,
      accountColor: sendingAccount.color,
      folderId: 'sent',
      remoteId: `remote-sent-${Date.now()}`,
      fromName: sendingAccount.displayName,
      fromAddress: sendingAccount.email,
      toAddresses: draft.to.split(',').map((s) => s.trim()),
      ccAddresses: draft.cc ? draft.cc.split(',').map((s) => s.trim()) : [],
      bccAddresses: draft.bcc ? draft.bcc.split(',').map((s) => s.trim()) : [],
      subject: draft.subject,
      snippet: draft.body.slice(0, 100),
      bodyPlain: draft.body,
      isRead: true,
      isStarred: false,
      hasAttachment: draft.attachments.length > 0,
      receivedAt: new Date().toISOString(),
      direction: /[\u0600-\u06FF]/.test(draft.subject + draft.body) ? 'rtl' : 'ltr',
    };

    set((state) => ({
      messages: [newMessage, ...state.messages],
      isComposeOpen: false,
      composeDraft: {
        fromAccountId: accounts[0]?.id || '',
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        attachments: [],
      },
    }));

    get().showToast({
      text: settings.language === 'ar'
        ? `تم الإرسال بنجاح من: ${sendingAccount.email}`
        : `Sent successfully from: ${sendingAccount.email}`,
      type: 'success',
    });

    return true;
  },

  triggerSyncAccount: (accountId) => {
    const { accounts, settings } = get();
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc || acc.status === 'paused') return;

    set({
      accounts: accounts.map((a) => (a.id === accountId ? { ...a, status: 'syncing' } : a)),
    });

    setTimeout(() => {
      set((s) => ({
        accounts: s.accounts.map((a) =>
          a.id === accountId
            ? {
                ...a,
                status: 'ready',
                lastSyncAt: new Date().toISOString(),
                errorMessage: undefined,
              }
            : a
        ),
      }));

      get().showToast({
        text: settings.language === 'ar'
          ? `اكتملت مزامنة الحساب: ${acc.email}`
          : `Sync completed for: ${acc.email}`,
        type: 'info',
      });
    }, 1500);
  },

  triggerSyncAll: () => {
    const { accounts, settings } = get();
    set({
      isSyncingAll: true,
      accounts: accounts.map((a) =>
        a.status === 'paused' || a.status === 'auth_required' ? a : { ...a, status: 'syncing' }
      ),
    });

    setTimeout(() => {
      set((s) => ({
        isSyncingAll: false,
        accounts: s.accounts.map((a) =>
          a.status === 'syncing'
            ? { ...a, status: 'ready', lastSyncAt: new Date().toISOString() }
            : a
        ),
      }));

      get().showToast({
        text: settings.language === 'ar'
          ? 'اكتملت مزامنة جميع الحسابات الجاهزة'
          : 'All ready accounts synced',
        type: 'success',
      });
    }, 2000);
  },

  addAccount: (accountData) => {
    const newId = `acc-${Date.now()}`;
    const newAcc: Account = {
      ...accountData,
      id: newId,
      unreadCount: 0,
      totalCount: 0,
      lastSyncAt: new Date().toISOString(),
      status: 'ready',
    };

    set((state) => ({
      accounts: [...state.accounts, newAcc],
    }));

    get().showToast({
      text: get().settings.language === 'ar'
        ? `تمت إضافة الحساب ${newAcc.email} بنجاح`
        : `Account ${newAcc.email} added successfully`,
      type: 'success',
    });
  },

  removeAccount: (accountId) => {
    const { accounts, messages, selectedAccountId, settings } = get();
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;

    set({
      accounts: accounts.filter((a) => a.id !== accountId),
      messages: messages.filter((m) => m.accountId !== accountId),
      selectedAccountId: selectedAccountId === accountId ? null : selectedAccountId,
      activeView: selectedAccountId === accountId ? 'unified_inbox' : get().activeView,
    });

    get().showToast({
      text: settings.language === 'ar'
        ? `تمت إزالة الحساب ${acc.email} ومسح الذاكرة المحلية له`
        : `Removed ${acc.email} and purged local cache`,
      type: 'warning',
    });
  },

  pauseAccount: (accountId) => {
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === accountId ? { ...a, status: 'paused' } : a
      ),
    }));
  },

  resumeAccount: (accountId) => {
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === accountId ? { ...a, status: 'ready' } : a
      ),
    }));
  },

  reconnectAccount: (accountId) => {
    const { accounts, settings } = get();
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;

    // Simulate OAuth PKCE or TLS handshake
    set({
      accounts: accounts.map((a) =>
        a.id === accountId ? { ...a, status: 'syncing' } : a
      ),
    });

    setTimeout(() => {
      set((s) => ({
        accounts: s.accounts.map((a) =>
          a.id === accountId
            ? { ...a, status: 'ready', errorMessage: undefined, lastSyncAt: new Date().toISOString() }
            : a
        ),
      }));

      get().showToast({
        text: settings.language === 'ar'
          ? `تمت إعادة المصادقة وربط الحساب: ${acc.email}`
          : `Re-authentication successful for: ${acc.email}`,
        type: 'success',
      });
    }, 1800);
  },

  allowRemoteImagesForMessage: (messageId) => {
    set((state) => {
      const updated = new Set(state.remoteImagesAllowed);
      updated.add(messageId);
      return { remoteImagesAllowed: updated };
    });
  },

  setTheme: (theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme === 'system' ? 'light' : theme);
    set((state) => ({ settings: { ...state.settings, theme } }));
  },

  setLanguage: (lang) => {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    set((state) => ({ settings: { ...state.settings, language: lang } }));
  },

  setDensity: (density) => {
    set((state) => ({ settings: { ...state.settings, density } }));
  },

  updateSettings: (newSettings) => {
    set((state) => ({ settings: { ...state.settings, ...newSettings } }));
  },

  openCompose: (initial = {}) => {
    const { accounts } = get();
    set({
      isComposeOpen: true,
      composeDraft: {
        fromAccountId: initial.fromAccountId || accounts[0]?.id || '',
        to: initial.to || '',
        cc: initial.cc || '',
        bcc: initial.bcc || '',
        subject: initial.subject || '',
        body: initial.body || '',
        attachments: initial.attachments || [],
        isReplyingToId: initial.isReplyingToId,
      },
    });
  },

  closeCompose: () => {
    set({ isComposeOpen: false });
  },

  updateComposeDraft: (updates) => {
    set((state) => ({
      composeDraft: { ...state.composeDraft, ...updates },
    }));
  },

  openAccountManager: () => set({ isAccountManagerOpen: true }),
  closeAccountManager: () => set({ isAccountManagerOpen: false }),

  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),

  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterUnreadOnly: (value) => set({ filterUnreadOnly: value }),
  setFilterStarredOnly: (value) => set({ filterStarredOnly: value }),
  setFilterHasAttachment: (value) => set({ filterHasAttachment: value }),
  setFilterAccountId: (id) => set({ filterAccountId: id }),

  loadStressTestData: (accountsCount, messagesCount) => {
    const accounts = generateSyntheticAccounts(accountsCount);
    const messages = generateSyntheticMessages(messagesCount, accounts);
    set({
      accounts,
      messages,
      selectedMessageId: messages[0]?.id || null,
      activeView: 'unified_inbox',
      selectedAccountId: null,
    });

    get().showToast({
      text: get().settings.language === 'ar'
        ? `تم تحميل ${accounts.length} حسابًا و ${messages.length} رسالة تركيبية لاختبار الأداء`
        : `Loaded ${accounts.length} accounts & ${messages.length} synthetic messages for stress testing`,
      type: 'info',
    });
  },

  resetToDefaultData: () => {
    set({
      accounts: INITIAL_ACCOUNTS,
      messages: INITIAL_MESSAGES,
      selectedMessageId: INITIAL_MESSAGES[0]?.id || null,
      activeView: 'unified_inbox',
      selectedAccountId: null,
    });

    get().showToast({
      text: get().settings.language === 'ar'
        ? 'تمت استعادة البيانات الافتراضية'
        : 'Reset to default fixtures',
      type: 'info',
    });
  },

  clearCache: (type) => {
    const { settings } = get();
    get().showToast({
      text: settings.language === 'ar'
        ? `تم تفريغ الذاكرة المحلية المؤقتة (${type === 'bodies' ? 'نصوص الرسائل' : type === 'attachments' ? 'المرفقات' : 'الكل'})`
        : `Cleared local cache (${type})`,
      type: 'info',
    });
  },

  showToast: (toast) => {
    const id = `toast-${Date.now()}`;
    set({ toast: { ...toast, id } });
    setTimeout(() => {
      if (get().toast?.id === id) {
        set({ toast: null });
      }
    }, 4500);
  },

  dismissToast: () => set({ toast: null }),

  triggerUndo: () => {
    const { undoStack } = get();
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    lastAction();
    set({
      undoStack: undoStack.slice(0, -1),
      toast: null,
    });
  },
}));
