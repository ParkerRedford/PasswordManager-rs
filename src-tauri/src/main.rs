// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use pm_rust_lib::accounts;


fn main() {
    pm_rust_lib::run()
}
