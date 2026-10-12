import React, { useEffect } from 'react';
import { useMailStore } from './store/mailStore';
import { MacTitlebar } from './components/layout/MacTitlebar';
import { Sidebar } from './components/layout/Sidebar';
import { MessageList } from './components/list/MessageList';
import { MessageReader } from './components/reader/MessageReader';
import { ComposeModal } from './components/compose/ComposeModal';
import { AccountManagerModal } from './components/accounts/AccountManagerModal';
import { SearchModal } from './components/search/SearchModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { DemoBanner } from './components/common/DemoBanner';
import { Toast } from './components/common/Toast';

export const App: React.FC = () => {
  const {
    settings,
    openCompose,
    openSearchModal,
    openSettings,
    triggerSyncAll,
    selectedMessageId,
    archiveMessage,
    deleteMessage,
    toggleStarred,
    toggleRead,
    triggerUndo,
  } = useMailStore();

  // Initialize theme & direction on mount
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme === 'system' ? 'light' : settings.theme);
    root.setAttribute('lang', settings.language);
    root.setAttribute('dir', settings.language === 'ar' ? 'rtl' : 'ltr');
  }, [settings.theme, settings.language]);

  // Global macOS keyboard shortcuts
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (e.target as HTMLElement).tagName
      );

      // Meta (⌘ on Mac) or Ctrl (on Linux/Windows)
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl) {
        if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          openSearchModal();
          return;
        }
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          openCompose();
          return;
        }
        if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          triggerSyncAll();
          return;
        }
        if (e.key === ',') {
          e.preventDefault();
          openSettings();
          return;
        }
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          triggerUndo();
          return;
        }
      }

      // Single-key shortcuts when NOT typing in an input
      if (!isInputFocused && selectedMessageId) {
        if (e.key.toLowerCase() === 'e') {
          e.preventDefault();
          archiveMessage(selectedMessageId);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          deleteMessage(selectedMessageId);
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          toggleStarred(selectedMessageId);
        } else if (e.key.toLowerCase() === 'u') {
          e.preventDefault();
          toggleRead(selectedMessageId);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [
    openSearchModal,
    openCompose,
    openSettings,
    triggerSyncAll,
    selectedMessageId,
    archiveMessage,
    deleteMessage,
    toggleStarred,
    toggleRead,
    triggerUndo,
  ]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-ui-bg text-ui-fg font-mac select-none">
      {/* macOS Window Titlebar */}
      <MacTitlebar />

      {/* Synthetic Demo Notification Banner */}
      <DemoBanner />

      {/* Main 3-Pane Mail Client Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Pane 1: Navigation / Accounts Sidebar */}
        <Sidebar />

        {/* Pane 2: Virtualized Message List */}
        <MessageList />

        {/* Pane 3: Message Reader / Detail */}
        <MessageReader />
      </main>

      {/* Floating Modals */}
      <ComposeModal />
      <AccountManagerModal />
      <SearchModal />
      <SettingsModal />

      {/* Floating Action Feedback Toasts with Undo */}
      <Toast />
    </div>
  );
};

export default App;
