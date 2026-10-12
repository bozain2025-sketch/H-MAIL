# Screen blueprints

## 1. Inbox / Unified view

```
┌──── macOS titlebar / draggable safe area + toolbar ─────────────────────────────────────────┐
│ Sync status   [search all mail..........................]           Compose +             │
├───────────────┬─────────────────────────────┬───────────────────────────────────────────────┤
│ Unified Inbox │ Inbox • 2,481 unread        │ Sender / recipient / timestamp               │
│ Starred       │ ┌─────────────────────────┐ │ Subject & actions                             │
│ Drafts        │ │ ● From • subject ...    │ │ Blocked external images bar                   │
│ Sent          │ │   preview / account     │ │                                               │
│───────────────│ ├─────────────────────────┤ │ Sanitized, isolated message content          │
│ Account groups│ │   From • subject ...    │ │                                               │
│ Company       │ │   preview / account     │ │                                               │
│ Personal      │ └─────────────────────────┘ │ Reply / forward / attachments                 │
│ Accounts      │ [incremental loading]       │                                               │
└───────────────┴─────────────────────────────┴───────────────────────────────────────────────┘
```

### Necessary states

- First run: select provider, connect account, show what gets synced; no mocked inbox portrayed as real.
- Loading: skeleton only within affected pane; switch accounts without freezing main navigation.
- No messages: concise description + relevant action.
- Partial sync: count/status, account-specific failures in a compact area.
- Offline: reading cache remains usable; clearly disable or queue outgoing features per product policy.
- Token expired: re-authenticate one account with no loss of locally cached messages.
- Large inbox: virtualized scrolling; preserve selection while new mail arrives.
- Batch actions: confirmation for permanent deletion; undo for archive/move where provider allows.

## 2. Add accounts

An account list and single-provider connection wizard, not dozens of credential fields at once. Let users choose Gmail, Microsoft, Other IMAP/SMTP. Explain permissions. OAuth opens system browser with PKCE and an explicit browser-return state. Support provider-specific errors and duplicate-account detection. Never encourage users to disclose the primary account password for Google or Microsoft.

## 3. Compose

Detachable modal or window with From (always visible), To/CC/BCC, Subject, rich/plain text body policy, attachment chips, Save Draft, Send. Choose sensible keyboard shortcuts. Restore drafts on restart. Prevent send when invalid recipients exist. Show failed send with retry and idempotency caution.

## 4. Search

Global query over local indexed content; filters: from/to/account/date/has attachments/unread, with status explaining whether results cover only synced messages. Place highlight within results; avoid highlighting user content unsafely via `innerHTML`.

## 5. Settings

Categories: Accounts, Sync & bandwidth, Local storage, Notifications, Appearance & language, Privacy, Shortcuts, Diagnostics. Per-account sync toggle and error detail; global storage limit; image-loading policy; retention and 'Remove local cache' operations with precise confirmations.

## 6. Window resizing and right-to-left

At widths below ~1160px: shrink sidebar to compact identity rail or hide via toggle, keep list + reader. Below ~850px: allow list/reader navigation mode while preserving state. Match reading order to active language; mixed-script addresses never reverse. Never position UI relative to screen instead of window bounds.
