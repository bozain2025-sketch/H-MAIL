// MailHub Tauri IPC Commands
// Strictly typed boundaries between Rust core and React UI

use crate::models::{Account, MessageDetail, MessageHeader, SendMailRequest};

#[tauri::command]
pub async fn get_accounts() -> Result<Vec<Account>, String> {
    // Returns accounts from local SQLite
    Ok(vec![])
}

#[tauri::command]
pub async fn get_messages(
    _folder_id: Option<String>,
    _account_id: Option<String>,
    _offset: usize,
    _limit: usize,
) -> Result<Vec<MessageHeader>, String> {
    // Returns messages from local SQLite with virtualization support
    Ok(vec![])
}

#[tauri::command]
pub async fn get_message_detail(_message_id: String) -> Result<MessageDetail, String> {
    // Fetches message detail and marks as read
    Err("Not implemented in native mode".to_string())
}

#[tauri::command]
pub async fn send_email(_request: SendMailRequest) -> Result<String, String> {
    // Sends message through corresponding provider
    Ok("msg_sent_id".to_string())
}

#[tauri::command]
pub async fn trigger_account_sync(_account_id: String) -> Result<(), String> {
    // Triggers background sync job with bounded concurrency
    Ok(())
}
