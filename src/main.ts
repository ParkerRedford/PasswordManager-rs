import { invoke } from "@tauri-apps/api/core";
import { AccountDisplay, initAccountsJson } from "./account";

// let greetInputEl: HTMLInputElement | null;
// let greetMsgEl: HTMLElement | null;

// async function greet() {
//   if (greetMsgEl && greetInputEl) {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     greetMsgEl.textContent = await invoke("greet", {
//       name: greetInputEl.value,
//     });
//   }
// }

async function generatePassword(n: number): Promise<string> {
  return await invoke("pm_generate_password", { n: n, excludes: [] });
}

async function setExcludes(array: string): Promise<boolean> {
  return await invoke("set_excludes");
}

window.addEventListener("DOMContentLoaded", async () => {
  let body = document.body;
  let accounts = await initAccountsJson();

  for (const acc of accounts) {
    body.appendChild(new AccountDisplay(acc));
  }
});
