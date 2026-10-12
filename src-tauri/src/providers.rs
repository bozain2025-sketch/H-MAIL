// MailHub Provider Abstraction
// Decouples Gmail API, Microsoft Graph, and generic IMAP/SMTP

use crate::models::{Account, MailFolder, MessageDetail, MessageHeader, SendMailRequest};
use async_trait::async_trait;

#[derive(Debug, thiserror::Error)]
pub enum ProviderError {
    #[error("Authentication expired or required: {0}")]
    AuthExpired(String),
    #[error("Rate limited by provider. Retry after {0} seconds")]
    RateLimited(u32),
    #[error("Network connection error: {0}")]
    Network(String),
    #[error("Protocol error: {0}")]
    Protocol(String),
    #[error("Invalid cursor, resync required: {0}")]
    CursorInvalid(String),
}

#[async_trait]
pub trait MailProvider: Send + Sync {
    async fn test_connection(&self, account: &Account) -> Result<bool, ProviderError>;
    async fn list_folders(&self, account: &Account) -> Result<Vec<MailFolder>, ProviderError>;
    async fn sync_headers(&self, account: &Account, folder: &MailFolder, cursor: Option<&str>) -> Result<(Vec<MessageHeader>, Option<String>), ProviderError>;
    async fn fetch_body(&self, account: &Account, remote_id: &str) -> Result<MessageDetail, ProviderError>;
    async fn send_message(&self, account: &Account, request: &SendMailRequest) -> Result<String, ProviderError>;
}
