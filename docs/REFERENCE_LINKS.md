# Official reference links — verified at planning time (2026-10-12)

These are planning references, not substitutes for checking current documentation at implementation time. No third-party skill was embedded or redistributed.

## Tauri / macOS ARM64

- Tauri 2 macOS app bundling: https://tauri.app/distribute/macos-application/
- Tauri 2 macOS App Store notes and ARM64/Universal target: https://tauri.app/distribute/app-store/
- Tauri CLI build flags: https://tauri.app/reference/cli/
- Tauri security / capabilities overview: https://tauri.app/security/

## Gmail

- Gmail API OAuth scopes and sensitive/restricted classification: https://developers.google.com/workspace/gmail/api/auth/scopes
- Gmail history incremental synchronization: https://developers.google.com/workspace/gmail/api/guides/sync
- Google native-app OAuth: https://developers.google.com/identity/protocols/oauth2/native-app
- Google API services user data policy: https://developers.google.com/terms/api-services-user-data-policy

## Microsoft

- Microsoft Graph message delta per folder: https://learn.microsoft.com/en-us/graph/delta-query-messages
- Microsoft identity OAuth authorization code + PKCE: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow
- Microsoft Graph mail permissions: https://learn.microsoft.com/en-us/graph/permissions-reference

## Protocols / security / UX

- IETF IMAP4rev2 (RFC 9051): https://www.rfc-editor.org/rfc/rfc9051
- IETF SMTP Submission (RFC 6409): https://www.rfc-editor.org/rfc/rfc6409
- OAuth 2.0 for native apps (RFC 8252): https://www.rfc-editor.org/rfc/rfc8252
- macOS Keychain Services: https://developer.apple.com/documentation/security/keychain_services
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- WCAG contrast minimum: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

## Optional third-party UI skill reference (not included in the archive)

- Anthropic `frontend-design` skill (Apache 2.0): https://github.com/anthropics/skills/tree/main/skills/frontend-design
- The packaged `macos-mail-ui` skill is purpose-built for this project and includes its own reference docs, tokens, fixtures and contrast checker.
