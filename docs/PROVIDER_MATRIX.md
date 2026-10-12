# Provider implementation and scope matrix

This matrix is a plan, **not a statement that features have been implemented**.

| Capability | Gmail API | Microsoft Graph | Generic IMAP/SMTP |
|---|---|---|---|
| Authorization | OAuth Desktop + PKCE | OAuth delegated + PKCE | OAuth2 if supported or provider-approved app password |
| Fetch folders/labels | Labels API | Mail folders | IMAP LIST |
| Fetch headers | Gmail messages/list/get | Graph messages | IMAP FETCH headers |
| Fetch body | Gmail get | Graph message body | IMAP BODYSTRUCTURE/FETCH |
| Send | Gmail send with scopes | Graph sendMail | SMTP submission |
| Incremental | Gmail history IDs | Per-folder delta tokens | UID/UIDVALIDITY; CONDSTORE/QRESYNC if available |
| Archive | Remove INBOX label | Move/other supported provider action | Move to archive folder if supported |
| Mark read/unread | Modify labels | Patch isRead | Store FLAGS |
| Delete | Trash or user-confirmed removal | Delete/move per policy | Move to Trash / mark deleted per server policy |
| Drafts | Gmail drafts API | Graph drafts | IMAP append only if server supports; local drafts baseline |
| Push notifications | Not required MVP | Not required MVP | IDLE for selected priority accounts only |

## Implementation ordering

1. Stable fake provider implementing the same interface for UI and all failure states.
2. IMAP/SMTP with a dedicated disposable test mailbox and captured MIME fixtures.
3. Gmail API with a dedicated test account and verified scopes.
4. Microsoft Graph with dedicated test accounts (personal and organizational if possible).
5. Optimize group scheduling and large-scale behavior only after provider adapters are correct.

## Compliance and limits

- Some Gmail scopes required for read/modify are **restricted**. Google OAuth app verification and possibly security assessment can be necessary depending on usage, storage/transmission, and distribution. Validate with current Google documentation.
- Graph delta sync is a per-folder operation with opaque next/delta URLs. Some organizations require admin consent or apply Conditional Access.
- IMAP IDLE/UIDPLUS/QRESYNC are provider-dependent capabilities, not required for every server.
- Different email providers have different sending quotas and acceptable authentication. Do not route email through third-party servers to evade those policies.
