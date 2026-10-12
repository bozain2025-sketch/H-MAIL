use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ProviderType {
    Gmail,
    Outlook,
    ImapSmtp,
    SyntheticDemo,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum AccountStatus {
    Disconnected,
    Authenticating,
    Ready,
    Syncing,
    RateLimited,
    AuthRequired,
    Offline,
    Error,
    Paused,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: String,
    pub email: String,
    pub display_name: String,
    pub provider: ProviderType,
    pub group_name: Option<String>,
    pub status: AccountStatus,
    pub last_sync_at: Option<String>,
    pub unread_count: u32,
    pub total_count: u32,
    pub error_message: Option<String>,
    pub sync_interval_minutes: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MailFolder {
    pub id: String,
    pub account_id: String,
    pub name: String,
    pub remote_id: String,
    pub folder_type: String, // inbox, sent, drafts, trash, archive, custom
    pub unread_count: u32,
    pub total_count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MessageHeader {
    pub id: String,
    pub account_id: String,
    pub folder_id: String,
    pub remote_id: String,
    pub from_address: String,
    pub from_name: String,
    pub to_addresses: Vec<String>,
    pub cc_addresses: Vec<String>,
    pub bcc_addresses: Vec<String>,
    pub subject: String,
    pub snippet: String,
    pub is_read: bool,
    pub is_starred: bool,
    pub has_attachments: bool,
    pub received_at: String,
    pub direction: String, // "rtl" | "ltr"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MessageDetail {
    pub header: MessageHeader,
    pub body_plain: String,
    pub body_html_sanitized: Option<String>,
    pub attachments: Vec<AttachmentInfo>,
    pub remote_images_blocked: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AttachmentInfo {
    pub id: String,
    pub filename: String,
    pub mime_type: String,
    pub size_bytes: u64,
    pub is_downloaded: bool,
    pub local_path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendMailRequest {
    pub account_id: String,
    pub to: Vec<String>,
    pub cc: Vec<String>,
    pub bcc: Vec<String>,
    pub subject: String,
    pub body_text: String,
    pub body_html: Option<String>,
    pub draft_id: Option<String>,
}
