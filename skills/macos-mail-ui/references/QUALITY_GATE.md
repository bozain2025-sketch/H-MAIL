# UI quality gate

A UI task cannot be marked complete until the applicable checks below are performed or their unavailability explicitly reported.

## Screenshot review

- Render 1440x900 and 1280x800 window sizes; narrow-window state; light and dark.
- Compare one screenshot with 3 messages and one with 1,000+ synthetic rows (virtualized) and a long multi-line subject.
- Inspect cropped text, hidden window controls, alignment/hover anomalies, unread prominence, pane resize affordances, unwanted scrollbars, and UI consistency.
- Ensure message content (not entire shell) scrolls independently where intended. Test Ctrl+/Cmd+wheel zoom behavior if supported.

## Interaction

- Add-account and reconnect flows are not dead ends; full onboarding includes cancel/retry.
- ⌘K search, ⌘N compose, ⌘R sync, ⌘, settings; list navigation works with keyboard; selection not lost after sync updates.
- Every exposed action has handler or a clearly documented disabled/in-progress state; avoid fake buttons.
- Save drafts, send with correct From address, reveal attachments only on user action.
- Bulk actions show explicit scope across accounts; destructive bulk actions require confirmation or undo.

## Privacy and trust

- No tokens in localStorage, JS logs, analytics, URLs, screenshots or mock data.
- Disable remote images and embedded scripts by default; confirm/allow trusted content only through secure preview architecture.
- Provider errors name the affected account without exposing secrets. Logging is redacted.
- Local search states which messages are indexed; do not promise that every cloud message is searchable.

## Accessibility

- Visible focus ring; tab order logical; Enter/Space and arrow navigation.
- Contrast WCAG AA (4.5:1 text); check tokens with script, then verify in rendered UI.
- VoiceOver labels for list rows/unread and account statuses, group navigation and announcements.
- Reduced motion enabled; color not sole carrier of state; do not rely solely on hover.
- Arabic RTL / English LTR and mixed-script display tested on list rows, compose and message viewer.

## Performance

- Virtualized list does not mount all messages; keep DOM row count bounded and measure scroll smoothness.
- Avoid React rerender of all visible rows when sync progress changes.
- Selecting a cached message shows immediately without blocking on network; show progressive body fetch if uncached.
- Keep skeletons short and context-specific; handle 100-account synthetic fixtures without becoming unusable.

## Final report format

Summarize: screens changed; design direction and tokens; screenshots/test coverage; accessibility/RTL findings; remaining issues; actual performance measurements (not guesses).
