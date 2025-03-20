// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use pm_rust_lib;
use tauri::{window, Builder, Emitter, Manager, Window};


fn main() {
    pm_rust_lib::run()
}
