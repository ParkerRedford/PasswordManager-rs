import { invoke } from "@tauri-apps/api/core";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
  }
}

async function generatePassword(): Promise<string> {
  return await invoke("pm_generate_password", { n: 6 });
}

async function setExcludes(array: string): Promise<boolean> {
  return await invoke("set_excludes");
}

window.addEventListener("DOMContentLoaded", async () => {
  let body = document.body;
  let el = document.createElement("p");
  
  el.textContent = await generatePassword();

  body.appendChild(el);

  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});
