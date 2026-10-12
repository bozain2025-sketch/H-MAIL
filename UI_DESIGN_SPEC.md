# MailHub — UI/UX Design Specification (macOS desktop)

> Use with `MASTER_PLAN.md` and the bundled `skills/macos-mail-ui/SKILL.md` prior to writing frontend code. This is not a marketing site. Every UI choice must improve multi-account email productivity.

## 1. Experience principles

1. **Account provenance is sacred**: always know *which mailbox* a message belongs to and *which sender account* will be used to reply.
2. **Fast scan > decorative flourish**: optimize for thousands of threads and dozens of account folders, with readable typography and compact-but-airy rows.
3. **Mac-native feel without fake native claims**: use system font, appropriate titlebar safe zones, `⌘` keyboard shortcuts, natural context menus, resizable panes, and responsive trackpad interactions.
4. **Local-first honesty**: surface partial sync and offline conditions accurately; never call a remote message "indexed" until it is actually in the local cache.
5. **Trust and privacy**: show when remote images are blocked; never place credentials in browser state.
6. **Accessible in Arabic and English**: application direction and message direction are separate concerns.
7. **Subtle polish**: one primary blue accent, focus states, refined dividers, restrained motion, crisp retina icons.

## 2. Design direction / token system

Recommended art direction: **precise productivity / cool slate**. Not a purple-gradient SaaS dashboard. Start from `skills/macos-mail-ui/assets/tokens.css`; adjust after screenshot review. Base palette:

| Color | Light | Dark | Role |
|---|---|---|---|
| Background | `#F7F9FC` | `#111923` | Window |
| Sidebar | `#EEF3F8` | `#192433` | Navigation |
| Surface | `#FFFFFF` | `#162231` | List/read panels |
| Foreground | `#142538` | `#E9F1FA` | Text |
| Secondary | `#53657B` | `#B2C3D4` | Meta labels |
| Stroke | `#D6E0EA` | `#314355` | Separators |
| Accent | `#176BD3` | `#80B9FF` | Selection, focus, primary actions |
| On accent | `#FFFFFF` | `#0A1624` | CTA text |

Use CSS variables and Tailwind theme mappings instead of scattering hex values through components. Use `-apple-system, BlinkMacSystemFont, system-ui, sans-serif`. Never bundle proprietary system font files.

### Sizing and spacing

- Baseline grid: 4px. Controls: approximately 28–36px; consistent radius 7–10px.
- Message row default: 64px (name + subject + snippet and account), compact 48–52px, comfortable 72px.
- Sidebar: 220–260px default, user-resizable or collapsible to 56–68px identity rail.
- Message list: 340–400px default and resizable; reader consumes remaining width.
- At 1440×900, first viewport should expose enough actual emails to be useful (not oversized welcome cards).
- Max lines: sender 1, subject 1–2, preview 1; truncate with tooltip/context if needed; never hide account source.
- Wide reader: constrain actual email body readability, while allowing tables and attachment preview to scroll in their own container.

## 3. Desktop window shell

```
┌────────────────────────────────────────── toolbar / titlebar ────────────────────────────────────────┐
│ [traffic lights] Search all messages                   [sync health] [refresh] [+ Compose]          │
├─────────────────────────┬────────────────────────────────────┬─────────────────────────────────────┤
│ Navigation / Accounts   │ Message list                       │ Message reader                      │
│ Unified Inbox  (98)     │ Inbox · 98 unread                  │ From: Avery <a@example.org>        │
│ Starred                 │ ┌────────────────────────────────┐ │ To: team@example.com              │
│ Drafts                  │ │ ● Request: shipping update     │ │ Subject                           │
│ Sent                    │ │   A short preview • Sales      │ │                                     │
│ ─────────────────────── │ ├────────────────────────────────┤ │ [remote images blocked]           │
│ Company accounts        │ │   Invoice INV-432 ...         │ │                                     │
│  ● sales@example.com    │ │   Attached report • Finance   │ │ Sanitized message viewer           │
│  ● billing@example.com  │ ├────────────────────────────────┤ │                                     │
│ Personal accounts       │ │   Internal review...          │ │                                     │
│  ● hello@example.net    │ └────────────────────────────────┘ │ Reply   Reply all   Forward        │
│ Account health          │ virtual scroll / paging            │                                     │
└─────────────────────────┴────────────────────────────────────┴─────────────────────────────────────┘
```

Adapt titlebar traffic-light spacing to Tauri's macOS window settings. Do not overlap draggable region and interactive controls. Use controlled resizable panes with persisted sizes; constrain minimum width to avoid broken layouts.

## 4. Sidebar and account identity

- Fixed top destinations: Unified Inbox / Starred / Drafts / Sent / Archive / All Mail (where supported).
- Group accounts by provider, custom categories, or user-generated groups. Provide search/filter when account list is long.
- Each account row: avatar/initials, address (truncated with full tooltip), unread count, and stable status indicator; status text visible on hover/focus or in account details.
- Distinguish syncing from reauthentication needed; amber/red statuses need text/icon equivalents.
- A footer/status entry shows pending actions, failed accounts, and local cache state, no meaningless analytics.
- Reorder/pin favorite accounts. Avoid opening every account simultaneously when hundreds exist.
- Account groups are organizational: clicking group filters unified list but does not move messages on the provider.

## 5. Message list (scalable)

- Use virtualization (e.g., TanStack Virtual or react-virtuoso; choose measured compatibility).
- Each row: unread marker, sender, subject, snippet, date, attachment, account identity; important labels only when useful.
- Highlight selected via subtle tinted background AND structural marker. Bold unread sender/subject; unread must be announced to screen reader.
- Stable keys based on account ID + provider message ID, never list index.
- Support single/multiselect, Shift-select range, Cmd-select items, select all in loaded scope with explicit scope.
- Context menu: reply, archive, mark unread, move (only if supported), spam (only if supported), delete with confirmation/undo.
- New messages should not reposition items unexpectedly while user reads one; provide new mail count badge / refresh indicator when appropriate.
- Loading: skeleton for visible rows only. Error: inline retry for affected account or page.

## 6. Reader pane (untrusted content)

- Header with sender display name plus address, recipient expansion, date/time, source account badge, appropriate actions.
- Render text/plain cleanly; MIME encoded headers and Unicode normalized.
- Render HTML only after Rust sanitization and isolation; never directly `dangerouslySetInnerHTML` untrusted content in privileged page. No script/cookies/autoloaded remote media.
- Show remote-content blocked explanation with explicit per-message allow button; preserve privacy defaults.
- URLs must have safe scheme; opening external browser requires explicit interaction. Handle long unbroken links without exploding reader width.
- Reader scroll independent of message list; secure download of attachments, predictable save dialogs.
- Support remote HTML tables in constrained scroll area and optional 'view plain text'.

## 7. Compose experience

- From account always visible and selectable. If initiated via reply, preselect the original recipient mailbox; keep it explicit.
- To/Cc/Bcc chips with validation, subject field, text body, attachment drop zone, signatures per account later.
- Autosave local drafts, show unsaved/queued/sent/error statuses clearly. Do not retry sending blindly after ambiguous timeouts.
- Keyboard: `⌘N` compose, `⌘Enter` send with confirmation option or conservative policy, Escape close with unsaved draft prompt.
- Defer rich editing until plain text or secure rich editor is stable; never ship a rich editor that breaks pasted Arabic text.
- Show upload/send progress and mention size/policy constraints without hardcoding a single provider's maximum.

## 8. Search

Global search field in toolbar (primary entry) plus advanced filters. Support filters `account`, `from`, `to`, `date range`, `unread`, `attachment`, `folder` with selected chips. Display "Results in downloaded/indexed mail" clearly; allow requesting older history for a selected account instead of promising server-wide search. Highlight safe spans without injecting untrusted HTML. Keep result list virtualized.

## 9. Screen and flow inventory

| Screen/state | Primary task | Acceptance criteria |
|---|---|---|
| Welcome | Add first account | Flow works or clearly explains missing provider settings |
| Account type picker | Choose provider | Gmail, Outlook/Microsoft, Other IMAP/SMTP |
| OAuth in progress | Await browser grant | Cancel/retry, secure callback validation, no password capture |
| Accounts | View/organize hundreds | Search, filter, group, pause/reconnect, status |
| Unified Inbox | Triage all mail | Account identity, fast scrolling, working actions |
| Single account | Isolate work | Correct account scopes, folders and unread counts |
| Message | Read safely | sanitized reader, attachments on demand |
| Compose/reply | Send from right identity | From explicit; success/error states |
| Search | Find local mail | Filters and honest coverage scope |
| Settings | Configure behavior | Theme, language, sync, privacy, cache |
| Sync health | Diagnose connection | Fault isolation and actionable repair |
| Offline | Read cached data | Clear offline messaging and safe queued actions policy |

## 10. RTL/LTR design rules

1. Language switch changes app shell direction; keep a user's per-account preference if requested later.
2. Sender email addresses, Message-IDs, URLs, phone numbers and dates use bidirectional isolation (e.g., `<bdi>` or controlled CSS direction); display them unchanged.
3. The reader content may be RTL or LTR independently; detect/follow MIME/body language preference without letting untrusted HTML override app chrome.
4. When app is RTL, reading order, pane order, icon semantics and keyboard focus follow RTL rules. Directional icons (back/next) must be mirrored where appropriate, not all icons.
5. Test long Arabic subjects, mixed Latin acronyms, quoted email chains, CC fields, search filters and numeric unread counts.

## 11. Keyboard and screen reader

- `⌘K` command/search palette; `⌘N` compose; `⌘R` sync active scope; `⌘,` settings; standard `⌘C/V/A` remain untouched inside inputs.
- Arrow navigation in message list, Enter to open, Escape to close overlay, Space toggle selection (if documented).
- Provide visible focus ring in both themes, `aria-label` for icon buttons, list semantics, live region for critical status only.
- Do not announce every sync polling tick; group asynchronous updates into meaningful notification messages.
- Ensure controls with 4.5:1 text contrast; `python3 skills/macos-mail-ui/scripts/check_contrast.py` checks starter token pairs but cannot replace manual QA.

## 12. Motion and performance

- Only microinteractions that explain change (toast, selection, pane open). Respect reduced motion preferences.
- Virtualize lists and batch sync events; avoid heavy shadows/glass filters inside each list row.
- No expensive compositing per mail row. Keep WebView layer performant on Retina screens.
- Loading/retry visible without blocking entire window. When online changes, update status without full reload.

## 13. Handoff artifacts from agent

- A design tokens file, reusable component catalog, tested screens, states and interactions.
- Light/dark Arabic/English screenshots, if tools support screen capture. If screenshots cannot be produced, state it clearly.
- Before/after screenshots for redesign tasks; rationale only for high-impact choices.
- Accessibility audit and known remaining gaps, not a generic "fully accessible" claim.

## 14. Anti-pattern rejection checklist

Reject any design with: giant decorative hero header; analytics pie charts; five huge tiles in place of inbox; rows without sender account; lost app content under macOS traffic-light buttons; no RTL; message HTML inserted into privileged DOM; mock send button pretending to send; missing offline/errors; unbounded list DOM; identical large pill buttons everywhere; nonfunctional keyboard shortcuts; tiny light-gray text below contrast thresholds.
