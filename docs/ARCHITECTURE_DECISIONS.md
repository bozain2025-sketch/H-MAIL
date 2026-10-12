# MailHub — Architecture Decision Records (ADRs)

**Last Updated:** 2026-10-12  
**Status:** In Progress (Phase 0 & Phase 1 Complete)

---

## ADR 001: Execution Environment and Target Platform Separation

- **Context:** MailHub targets **macOS 13+ on Apple Silicon (aarch64-apple-darwin)** as specified in `MASTER_PLAN.md`. The present development and CI container runs on Linux x86_64 (`Linux 6.1.158+ x86_64`, Node v22, Python 3.11).
- **Decision:**
  - Build the full cross-platform desktop UI using Vite, React 18, TypeScript, and Tailwind CSS.
  - Implement the full Tauri 2 configuration (`src-tauri/tauri.conf.json`) specifying `bundle.macOS.minimumSystemVersion = "13.0"` and bundle identifier `com.mailhub.desktop`.
  - Provide a complete synthetic mock engine and fixture data generator so all features (three-pane layout, virtualization, multi-account routing, compose, search, settings, and sync state transitions) can be verified locally and interactively in the browser live preview.
  - Rust/Keychain integration targets macOS via `cfg(target_os = "macos")` with non-macOS fallbacks.
  - Strictly observe the rule: **Do not claim to have produced a signed or notarized `.app`/`.dmg` until built on an Apple Silicon macOS host**.

---

## ADR 002: Token System and macOS Visual Identity

- **Context:** `skills/macos-mail-ui/SKILL.md` and `UI_DESIGN_SPEC.md` mandate high density, crisp macOS typography, and a calm slate palette without flashy dashboard decorations.
- **Decision:**
  - Adopted semantic CSS tokens from `skills/macos-mail-ui/assets/tokens.css` with 100% WCAG AA text contrast passing (`python3 skills/macos-mail-ui/scripts/check_contrast.py` verified).
  - Configured Tailwind CSS with custom `ui-*` semantic tokens mapped to CSS variables for instant theme switching without re-rendering.
  - Implemented macOS titlebar overlay safe zones (traffic light clearance).

---

## ADR 003: Arabic RTL and English LTR Dual-Mode Architecture

- **Context:** Email clients must handle both application-level localization (Arabic vs English) and message-level content direction, without corrupting email addresses, URLs, or timestamps.
- **Decision:**
  - Application direction is controlled at root level (`dir="rtl"` for Arabic, `dir="ltr"` for English).
  - Every email address and technical identifier is wrapped in `<bdi>` or styled with `direction: ltr; unicode-bidi: isolate;` to guarantee correct presentation regardless of ambient text direction.
  - Message reader dynamically determines body direction based on content script heuristics while preserving header layout.

---

## ADR 004: Virtualized Message List and 1,000+ Account Scale

- **Context:** `MASTER_PLAN.md` specifies that managing dozens to hundreds of accounts and thousands of messages must remain fluid without mounting unbounded DOM elements.
- **Decision:**
  - Integrated `@tanstack/react-virtual` for dynamic DOM virtualization. Only visible rows (+ overscan) are rendered.
  - Row height default is 64px, with user-selectable compact (48px) and comfortable (72px) modes.
  - Included a synthetic generator capable of instantiating 100+ accounts and 1,000+ messages for realistic stress testing.

---

## ADR 005: Security, Credential Isolation, and Untrusted HTML Isolation

- **Context:** Mail content and attachments are untrusted. Credentials must never enter browser localStorage or logs.
- **Decision:**
  - Remote images are blocked by default with an explicit opt-in confirmation banner per message.
  - HTML emails are rendered inside an isolated, sandboxed viewer with no access to Tauri IPC commands or scripts.
  - All mock data and synthetic demo accounts are explicitly marked with a warning banner to avoid misrepresenting fake fixtures as real mailboxes.
