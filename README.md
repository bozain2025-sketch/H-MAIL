# MailHub (H-MAIL) — High-Density Multi-Account macOS Desktop Mail Client

**Target Platform:** macOS 13+ on Apple Silicon (M1/M2/M3/M4, `aarch64-apple-darwin`)  
**Core Technologies:** Tauri 2, Rust (Tokio, SQLite with FTS5, macOS Keychain), React 18, TypeScript, Vite, Tailwind CSS, TanStack Virtual.  
**Design System:** `skills/macos-mail-ui` macOS-native tokens with WCAG AA compliance.

---

## 1. Quick Start & Development

```bash
# Install dependencies
pnpm install

# Run dev preview server (accessible at 0.0.0.0:3000)
pnpm dev

# Type check TypeScript codebase
pnpm typecheck

# Run test suite
pnpm test

# Verify WCAG contrast of design tokens
pnpm check:contrast

# Build production bundle
pnpm build
```

---

## 2. Implemented Architecture & Features

### A. Three-Pane macOS Window Shell
- **macOS Window Controls:** Titlebar with traffic lights safe zone, draggable regions, and quick action bar (`⌘K` Search, `⌘R` Sync, `⌘N` Compose, `⌘,` Settings).
- **Navigation Sidebar (Pane 1):** Standard unified folders (Unified Inbox, Starred, Drafts, Sent, Archive) and collapsible account groups (Work, Personal).
- **Virtualized Message List (Pane 2):** Virtualized using `@tanstack/react-virtual`. Seamlessly handles 1,000+ messages without DOM bloat. Dynamic density modes (compact: 52px, default: 64px, comfortable: 74px).
- **Reading Pane (Pane 3):** Full message inspector with explicit account provenance, sender/recipient metadata, isolated sanitized HTML viewer, attachment manager, and quick inline reply.

### B. Account Provenance & Multi-Account Isolation
- **Sacred Provenance:** Every email clearly displays which specific mailbox it arrived in.
- **Explicit "From" Routing:** Composing or replying always explicitly specifies the sending account, preventing accidental identity leakage.
- **Provider Diversity:** Support for generic IMAP/SMTP with TLS, Google Gmail API with OAuth PKCE, and Microsoft Graph with Delta queries.
- **Per-Account Error Isolation:** One account encountering rate-limiting (HTTP 429) or token expiration does not interrupt or block other accounts.

### C. Arabic RTL and English LTR Support
- Root-level directional switching (`dir="rtl"` for Arabic, `dir="ltr"` for English).
- Email addresses, URLs, and timestamps are isolated via `<bdi>` and `direction: ltr; unicode-bidi: isolate;` to prevent reversal or garbling in Arabic text.

### D. Security & Untrusted Content Isolation
- **Keychain Storage:** OAuth tokens and passwords are fundamentally isolated from JavaScript, SQLite, and logs, targeting macOS Keychain.
- **Remote Image Blocking:** Remote tracking pixels and external images are blocked by default, with an opt-in confirmation bar per message.
- **Untrusted HTML Sanitization:** Email body rendering is sandboxed with zero access to Tauri IPC commands.

### E. Synthetic Demo Mode & Scale Simulator
- In early stages or when developing without live provider credentials, an explicit **Synthetic Demo Banner** is displayed.
- Built-in generator can instantiate **100 accounts and 1,000 messages** on demand to benchmark UI virtualization and responsiveness.

---

## 3. Documentation Reference
- `MASTER_PLAN.md` — Complete engineering roadmap and phase breakdown.
- `UI_DESIGN_SPEC.md` — UI/UX specification and component definitions.
- `docs/ARCHITECTURE_DECISIONS.md` — Architecture Decision Records (ADRs).
- `docs/ACCEPTANCE_CHECKLIST.md` — Acceptance checklist and verification results.
- `skills/macos-mail-ui/SKILL.md` — macOS design craft guidelines and contrast scripts.
