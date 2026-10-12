# Design direction: precise Mac productivity

## Purpose and users

A local-first desktop client for an operator juggling 10 to 1,000+ mail accounts. Its primary advantage is clarity at scale, not the number of visual effects. Visible account provenance and recoverable per-account failures build trust.

## Art direction

Name (working): **MailHub**. Personality: calm, technically capable, intentionally compact. Use macOS-native-feeling typography and control heights, fine separators, translucent materials only if they improve hierarchy, and a single confident blue active accent. Distinctive element: elegant account identity rails, grouped account badges and refined unread states, *not* colorful dashboard tiles.

### Starter colors

| Semantic token | Light | Dark |
| --- | --- | --- |
| Window background | `#F7F9FC` | `#111923` |
| Sidebar background | `#EEF3F8` | `#192433` |
| Panel background | `#FFFFFF` | `#162231` |
| Primary text | `#142538` | `#E9F1FA` |
| Muted text | `#53657B` | `#B2C3D4` |
| Border | `#D6E0EA` | `#314355` |
| Active accent | `#176BD3` | `#80B9FF` |
| Accent text | `#FFFFFF` | `#0A1624` |
| Error text | `#A52C3B` | `#FF9AA3` |

Test text/background pairs rather than assuming the palette alone ensures WCAG contrast. Use `assets/tokens.css` as a starter, not a mandatory brand.

### Type, spacing, density

- System UI font stack first: `-apple-system, BlinkMacSystemFont, system-ui, sans-serif` (SF when available). Do not embed or distribute Apple system fonts.
- Body 13–14px at default density; subject rows 13–14px semibold when unread; preview 12–13px; compact metadata 11–12px only for secondary labels.
- 4px spacing grid. Default message list rows 64px (two-line preview); compact 48–52px; comfortable 72px. Provide density setting, not per-screen random heights.
- Pane desktop guide at 1440px: sidebar 220–260px; message list 340–400px; reader the remainder (min 480px). Allow user-resizable dividers and remember widths locally.
- Selected states need background + marker or border; unread = weight + subtle dot + accessible label.
- Reply/send affordances live near message context; global search is visible in toolbar, not hidden in a dashboard.
- Use SVG/Lucide-like icons at consistent 16–18px stroke weight; use CSS variables for their colors.

## Desktop interactions

- Sidebar groups: Unified Inbox, Starred, Drafts, Sent, Archive, All Accounts, then user-created groups. Accounts show provider mark/initials + unread count + status (healthy, syncing, authentication required, rate limited) with text on hover.
- Toolbar: global search, sync status, density controls in settings; first-class keyboard operation.
- List row: sender, subject, clipped preview, date, attachment, provider/account label, unread, flagged; support bulk selection and context menus.
- Reader: show sender and recipient identities clearly. Block remote images and show an unobtrusive consent bar. Preserve sender address and message direction correctly.
- Compose: always show FROM account selection; validate destination addresses; warn before quitting with unsaved draft; show attachments and queued/sending/failure states.

## Accessibility / i18n

- Test VoiceOver and keyboard with real native Mac builds when possible. Tooltips supplement visible labels; they do not replace them.
- Keyboard shortcuts must be documented and avoid clobbering input field shortcuts or standard macOS menu items.
- UI translation can switch between Arabic (`dir=rtl`) and English (`dir=ltr`); message HTML must derive `dir` per message and isolate direction with `bdi` for email addresses and mixed-script fragments.
- Contrast normal text >=4.5:1, large text >=3:1, visible focus rings in both themes. Hover must never be required to discover essential actions.
- Reduce motion: no forced animated sliding panels; respect `prefers-reduced-motion`.

## Avoid

Generic hero statistics, repetitive rounded cards, unrequested AI buttons, huge empty panes, decorative gradients, indistinguishable monochrome account indicators, raw HTML injection, fixed pixel widths that clip window controls, and a design that works only with five sample emails.
