// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri::{Emitter, Window};

pub mod accounts {
    pub mod metadata;
    pub mod account;
    pub mod p_generator;
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn pm_generate_password(n: u8, excludes: Vec<char>) -> String {
    let mut pmanager = accounts::p_generator::GeneratorManager::new();
    pmanager.set_excludes(excludes);

    pmanager.generate_password(n)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, pm_generate_password, accounts::account::init_accounts, accounts::account::init_accounts_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
