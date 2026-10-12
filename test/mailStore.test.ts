import { describe, it, expect, beforeEach } from 'vitest';
import { useMailStore } from '../src/store/mailStore';
import { generateSyntheticAccounts, generateSyntheticMessages } from '../src/fixtures/mockData';

describe('MailHub Core Store & Logic', () => {
  beforeEach(() => {
    useMailStore.getState().resetToDefaultData();
  });

  it('initializes with default multi-account dataset', () => {
    const { accounts, messages } = useMailStore.getState();
    expect(accounts.length).toBeGreaterThanOrEqual(4);
    expect(messages.length).toBeGreaterThanOrEqual(5);

    // Verify presence of diverse provider accounts
    const providers = accounts.map((a) => a.provider);
    expect(providers).toContain('imap');
    expect(providers).toContain('gmail');
    expect(providers).toContain('outlook');
  });

  it('toggles read status and updates account unread counter', () => {
    const store = useMailStore.getState();
    const msg = store.messages[0];
    const accountBefore = store.accounts.find((a) => a.id === msg.accountId);
    const unreadBefore = accountBefore!.unreadCount;

    // Toggle read
    store.toggleRead(msg.id);

    const updatedMsg = useMailStore.getState().messages.find((m) => m.id === msg.id);
    const accountAfter = useMailStore.getState().accounts.find((a) => a.id === msg.accountId);

    expect(updatedMsg?.isRead).toBe(!msg.isRead);
    if (!msg.isRead) {
      expect(accountAfter?.unreadCount).toBe(Math.max(0, unreadBefore - 1));
    } else {
      expect(accountAfter?.unreadCount).toBe(unreadBefore + 1);
    }
  });

  it('toggles star on a message', () => {
    const store = useMailStore.getState();
    const msg = store.messages[0];
    const initialStarred = msg.isStarred;

    store.toggleStarred(msg.id);
    const updated = useMailStore.getState().messages.find((m) => m.id === msg.id);
    expect(updated?.isStarred).toBe(!initialStarred);
  });

  it('archives a message and supports immediate undo', () => {
    const store = useMailStore.getState();
    const msg = store.messages[0];
    const originalFolder = msg.folderId;

    store.archiveMessage(msg.id);
    const archivedMsg = useMailStore.getState().messages.find((m) => m.id === msg.id);
    expect(archivedMsg?.folderId).toBe('archive');

    // Trigger Undo
    store.triggerUndo();
    const restoredMsg = useMailStore.getState().messages.find((m) => m.id === msg.id);
    expect(restoredMsg?.folderId).toBe(originalFolder);
  });

  it('deletes a message to trash and supports undo', () => {
    const store = useMailStore.getState();
    const msg = store.messages[0];
    const originalFolder = msg.folderId;

    store.deleteMessage(msg.id);
    const trashedMsg = useMailStore.getState().messages.find((m) => m.id === msg.id);
    expect(trashedMsg?.folderId).toBe('trash');

    // Trigger Undo
    store.triggerUndo();
    const restoredMsg = useMailStore.getState().messages.find((m) => m.id === msg.id);
    expect(restoredMsg?.folderId).toBe(originalFolder);
  });

  it('sends email with explicit From provenance', async () => {
    const store = useMailStore.getState();
    const sendingAccount = store.accounts[0];

    const success = await store.sendMessage({
      fromAccountId: sendingAccount.id,
      to: 'recipient@partner-corp.com',
      cc: '',
      bcc: '',
      subject: 'Test Outgoing Subject',
      body: 'Body content of outgoing email',
      attachments: [],
    });

    expect(success).toBe(true);

    const sentMessages = useMailStore.getState().messages.filter((m) => m.folderId === 'sent');
    expect(sentMessages.length).toBeGreaterThan(0);
    const latestSent = sentMessages[0];
    expect(latestSent.accountId).toBe(sendingAccount.id);
    expect(latestSent.fromAddress).toBe(sendingAccount.email);
    expect(latestSent.subject).toBe('Test Outgoing Subject');
  });

  it('generates high-density stress test dataset correctly', () => {
    const generatedAccounts = generateSyntheticAccounts(50);
    expect(generatedAccounts.length).toBe(50);

    const generatedMessages = generateSyntheticMessages(500, generatedAccounts);
    expect(generatedMessages.length).toBe(505); // 5 initial + 500 synthetic

    // Verify all messages reference existing valid account IDs
    const accountIds = new Set(generatedAccounts.map((a) => a.id));
    generatedMessages.forEach((msg) => {
      expect(accountIds.has(msg.accountId)).toBe(true);
    });
  });
});
