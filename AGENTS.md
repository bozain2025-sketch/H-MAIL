# Instructions for coding agents (MailHub)

This directory is the **project root**. Before writing code, read:

1. `MASTER_PLAN.md` (implementation authority)
2. `UI_DESIGN_SPEC.md` (UI/UX authority)
3. `skills/macos-mail-ui/SKILL.md` and referenced skill resources for UI work
4. `docs/ACCEPTANCE_CHECKLIST.md`
5. `docs/PROVIDER_MATRIX.md`
6. `prompts/START_AGENT_EN.md`

Start from **Phase 0**, then Phase 1. Scaffold project **in this project root** where practical, preserving these documents and the `skills/` directory (do not replace or delete them). Implement real code in iterative phases and run checks; never claim runtime/build or provider functionality without direct observed evidence. Do not insert actual credentials or user mailbox contents into source or fixtures.

Target: macOS Apple Silicon M1+, Rust + Tauri 2 + React/TypeScript; local-first, secure Keychain credentials, fair bounded sync, high-quality three-pane inbox and Arabic/English RTL/LTR support.

For UI design tasks, follow `skills/macos-mail-ui/SKILL.md` and verify `python3 skills/macos-mail-ui/scripts/check_contrast.py`. Source mail HTML is untrusted; never give it privileged Tauri IPC capabilities.

When blocked on provider credentials, implement a **clearly labeled synthetic-demo mode** and document how the owner configures their own OAuth application later. Never claim real provider sync happened in demo mode.

Maintain `docs/ARCHITECTURE_DECISIONS.md` as work progresses, test per phase, and produce actual `.app`/`.dmg` only if the current machine and credentials permit.
