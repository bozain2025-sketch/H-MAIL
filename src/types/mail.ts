// MailHub Domain Types

export type ProviderType = 'gmail' | 'outlook' | 'imap' | 'synthetic';

export type AccountStatus =
  | 'ready'
  | 'syncing'
  | 'rate_limited'
  | 'auth_required'
  | 'offline'
  | 'error'
  | 'paused';

export interface Account {
  id: string;
  email: string;
  displayName: string;
  provider: ProviderType;
  groupName: string;
  status: AccountStatus;
  unreadCount: number;
  totalCount: number;
  lastSyncAt: string;
  errorMessage?: string;
  syncIntervalMinutes: number;
  color: string;
}

export type FolderType = 'inbox' | 'starred' | 'drafts' | 'sent' | 'archive' | 'trash' | 'custom';

export interface Folder {
  id: string;
  accountId?: string; // undefined if unified
  name: string;
  nameAr: string;
  folderType: FolderType;
  unreadCount: number;
  totalCount: number;
  iconName: string;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  isDownloaded: boolean;
}

export interface Message {
  id: string;
  accountId: string;
  accountEmail: string;
  accountColor: string;
  folderId: string;
  remoteId: string;
  fromName: string;
  fromAddress: string;
  toAddresses: string[];
  ccAddresses?: string[];
  bccAddresses?: string[];
  subject: string;
  snippet: string;
  bodyPlain: string;
  bodyHtml?: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  attachments?: Attachment[];
  receivedAt: string;
  direction: 'rtl' | 'ltr';
  labels?: string[];
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageMode = 'ar' | 'en';
export type DensityMode = 'compact' | 'default' | 'comfortable';

export interface UserSettings {
  theme: ThemeMode;
  language: LanguageMode;
  density: DensityMode;
  syncIntervalMinutes: number;
  globalParallelSyncs: number;
  initialSyncDays: number;
  blockRemoteImages: boolean;
  cacheLimitMb: number;
}

export interface ToastMessage {
  id: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
}
