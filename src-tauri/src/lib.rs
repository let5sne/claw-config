mod models;
mod service;
mod error;
mod commands;

use commands::*;
use service::ConfigService;
use std::sync::Mutex;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let config_service = ConfigService::new()
                .expect("Failed to create config service");

            app.manage(commands::AppState {
                config_service: Mutex::new(config_service),
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Config commands
            get_config,
            save_config,
            get_config_path,
            config_exists,
            backup_config,
            restore_config,
            // Provider commands
            get_providers,
            add_provider,
            update_provider,
            delete_provider,
            // Agents commands
            get_agents_defaults,
            save_agents_defaults,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
