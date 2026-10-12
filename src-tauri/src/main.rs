// MailHub - macOS desktop client
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    mailhub_core::run();
}
