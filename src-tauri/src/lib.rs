// MailHub Core Library
pub mod commands;
pub mod db;
pub mod keychain;
pub mod models;
pub mod providers;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::get_accounts,
            commands::get_messages,
            commands::get_message_detail,
            commands::send_email,
            commands::trigger_account_sync,
        ])
        .run(tauri::generate_context!())
        .expect("error while running MailHub desktop application");
}
