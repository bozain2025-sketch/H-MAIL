# Copy-paste coding-agent prompt (English)

You are the principal macOS + Rust/Tauri engineer and product UI designer. Build **MailHub**, a local-first multi-account email application for **Apple Silicon Macs (M1 and newer)**, following the specifications in the current repository.

**Read these files before changing code, in this order:**
1. `README_START_HERE.md`
2. `MASTER_PLAN.md`
3. `UI_DESIGN_SPEC.md`
4. `skills/macos-mail-ui/SKILL.md`
5. Every referenced file under `skills/macos-mail-ui/references/` relevant to the current screen
6. `docs/ACCEPTANCE_CHECKLIST.md`
7. `docs/REFERENCE_LINKS.md`

**Technical target:** Tauri 2, Rust stable/Tokio, React, TypeScript, Vite, Tailwind CSS, SQLite (+ FTS5 if verified), native macOS Keychain, provider adapters (generic IMAP/SMTP, Gmail API OAuth, Microsoft Graph OAuth), release target `aarch64-apple-darwin`. Minimum OS is initially macOS 13; verify and record compatibility.

**Deliver real work, not just an outline.** Start by checking the actual working directory and tools, create the starter project if absent, and implement in the exact phases outlined in `MASTER_PLAN.md`. Each phase must leave runnable and verifiable code. Do not jump to a big-bang implementation or invent a backend cloud service.

**Critical product rules:**
- Support a unified inbox with clear account provenance and explicit "From" when replying/sending.
- Design for dozens to hundreds of accounts using fair bounded sync scheduling, provider-aware limits, and metadata-first caching. Never open a permanent socket per account by default.
- Store OAuth tokens/secrets only in macOS Keychain; use PKCE and system-browser sign-in; never request ordinary Gmail/Microsoft passwords.
- Keep HTML email untrusted and isolated; sanitize; disable remote images by default; do not expose Tauri IPC to message HTML.
- Support Arabic RTL and English LTR including mixed-direction addresses and email bodies; light/dark mode, keyboard shortcuts, VoiceOver, resizable 3-pane UI.
- Maintain precise type-checkable IPC contracts and per-account error isolation.
- Implement an explicitly labeled demo/fixture mode for early UI work. Do not misrepresent it as connected real mail.
- Don't invent secrets, successful builds, benchmark numbers, or email-provider permissions. Implement useful stubs/config UIs if external OAuth credentials are unavailable.
- Follow `macos-mail-ui` skill for every UI task, and run its contrast check.

**Working protocol:**
1. Inspect environment; make a concise checklist of Phase 0 tasks.
2. Implement Phase 0 and Phase 1 before remote provider connections, unless an existing project justifies a different order.
3. After each phase, run available checks (format, lint, TypeScript, Rust tests, macOS builds where available), and fix errors. Report exact commands and observed results.
4. Keep `docs/ARCHITECTURE_DECISIONS.md` for deviations, version pinning, threats, OAuth setup, and unsupported functionality.
5. For UI, render screenshots and visually inspect them in light/dark and Arabic/English if runtime tools permit. Otherwise state that visual verification was not possible.
6. Review against `docs/ACCEPTANCE_CHECKLIST.md`, marking items as verified/not yet verified. Do not claim done for untested OAuth providers.
7. At the end of each phase, give a concise status: files changed, working features, actual tests/build output, blockers and next phase.

If working on a non-macOS machine, develop/test what you can but **do not claim to have produced a signed or executed Mac app**. Actual `.app`/`.dmg` needs a macOS build environment and signing/notarization credentials for distribution as applicable.

**Begin now with Phase 0.** Assume sensible defaults where the specification intentionally leaves a choice; record assumptions rather than asking repeated questions. Ask only for external account/OAuth credentials at the point they are truly essential, and never ask the user to paste secrets into chat or commit them to source control.
