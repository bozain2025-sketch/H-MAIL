---
name: macos-mail-ui
description: Design, build, critique, and polish premium macOS desktop email-client interfaces using React, TypeScript, Tailwind, and Tauri. Use this skill whenever creating or changing screens, navigation, inbox tables, message readers, account management, compose dialogs, accessibility, keyboard interactions, dark mode, or RTL/LTR behavior for a multi-account Mac mail app. Produce working components and visual QA, not generic wireframes.
---

# macOS Mail UI Craft

Create a focused, Mac-native-feeling, high-density multi-account email client. Favor actual mail workflows over generic dashboards and decorative cards.

## Load context first

1. Read the project's `MASTER_PLAN.md` and `UI_DESIGN_SPEC.md` if available; obey their technical and product constraints. If they are absent, use this skill's references as defaults.
2. Inspect existing code and tokens before proposing redesign. Preserve working flows and reuse established components.
3. Read `references/DESIGN_DIRECTION.md` for product-specific design tokens, interaction patterns, and anti-patterns.
4. Read `references/SCREEN_BLUEPRINTS.md` for layouts/states before implementing a screen.
5. Read `references/QUALITY_GATE.md` before finalizing or claiming a screen is complete.

## Design-first, implementation-second workflow

1. Define the user's core task for the screen in one sentence. State information hierarchy, primary action, and the most important error/empty state.
2. Produce a compact design decision list: palette and hierarchy, panes and spacing, interactions, keyboard behavior, long-text handling, RTL/LTR, and dark mode. Do not create long generic strategy memos.
3. Implement the real React + TypeScript component(s), focusing on readable architecture and meaningful sample data; ensure all advertised actions are functional or clearly labeled as unimplemented.
4. Keep complex data and sync state outside UI components. Use typed hooks and selector-based state subscriptions to limit re-renders.
5. Add loading, empty, offline, auth-expired, rate-limited, and partial-failure states. Avoid globally blocking the app when one account fails.
6. Exercise keyboard-only usage and mouse/trackpad input; ensure obvious tab order, visible focus, and menu behavior. Observe macOS conventions.
7. If UI runtime/screenshot tooling exists, render and inspect screenshots in light/dark and Arabic/English at 1440x900 and 1280x800. Fix clipped labels, overflow, spacing and contrast; otherwise disclose the missing visual verification.
8. Run available checks (`lint`, `typecheck`, tests) and run the bundled token-contrast check if using the suggested token palette.

## Non-negotiable rules

- Use a **three-pane desktop layout** by default: accounts/folders, virtualized message list, reading pane. Collapse to two panes when the window narrows, then to a single pane only when necessary.
- Do not make the inbox look like a SaaS analytics dashboard. No meaningless charts, decorative hero cards, neon gradients, oversized empty space, or arbitrary glass blur.
- Use macOS window conventions: draggable titlebar region when supported, traffic-light safe area, appropriate native menus, and shortcuts (`⌘K`, `⌘N`, `⌘R`, `⌘,`). Never hide system window controls.
- Use semantic, accessible controls. Make all account colors redundant with labels/icons; never indicate read/unread or sync errors using color alone.
- Support keyboard focus rings, reduced motion, screen-reader labels, minimum 4.5:1 contrast for regular text, appropriate hit areas, and adjustable density.
- Treat Arabic RTL at the **app-shell level** independently of each message's content direction. Support Arabic subjects with English addresses, URLs, times, and mixed script without reversed email addresses.
- Be deliberate about information density. Favor natural content hierarchy; separators and subtle selected states instead of heavy cards or repeated pill/badge decoration.
- Keep menu commands and keyboard shortcuts consistent. Show descriptive toasts for actions and offer undo for reversible destructive operations.
- Never render raw email HTML directly into the trusted application DOM. Use the project's sanitized, isolated message preview path; images and remote content are blocked until the user explicitly opts in.
- Never put API credentials, tokens, or real personal emails into mock data, screenshots, source code, or logs.

## Definition of done for a new screen

Deliver: component code + any state/typing changes + states table + keyboard/RTL audit + tests + rendered screenshots if tools permit. The screen is not done with visual polish alone; it must handle real-sized lists, empty/error states, resizing, and accessibility.

## Bundled resources

- `references/DESIGN_DIRECTION.md`: specific art direction, palette, typography, spacing, layout and density choices.
- `references/SCREEN_BLUEPRINTS.md`: blueprints for inbox, account onboarding, compose, search and settings.
- `references/QUALITY_GATE.md`: end-to-end visual, interaction, accessibility and performance checklist.
- `assets/tokens.css`: starter design tokens (adapt to the project's Tailwind setup).
- `assets/sample_messages.json`: anonymous synthetic fixture records for realistic UI testing.
- `scripts/check_contrast.py`: dependency-free contrast check for the bundled text token pairs.

The original project requirements override default palettes and visual preferences in this skill.
