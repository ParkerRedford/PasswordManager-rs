import { invoke } from "@tauri-apps/api/core";
import { AccountDOM, initAccountsJson, Account, initAccounts, GeneratedButtonClick } from "./account";
import { Popup, PopupsDOM } from "./popups";

async function generatePassword(n: number): Promise<string> {
  return await invoke("pm_generate_password", { n: n, excludes: [] });
}

async function setExcludes(array: string): Promise<boolean> {
  return await invoke("set_excludes");
}

window.addEventListener("DOMContentLoaded", async () => {
  let body = document.body;
  body.style.margin = "0";

  function fill() {
    for (const acc of accounts) {
      body.appendChild(new AccountDOM(acc));
    }
  }

  let accounts: Array<Account> = [];
  let text = document.createElement("p");

  // let json = document.createElement("button");
  // json.innerText = "JSON";
  // json.addEventListener("click", async function() {
     accounts = await initAccountsJson();
  //   text.remove();
  //   this.remove();

  //   fill();
  // });

  // let bson = document.createElement("button");
  // bson.innerHTML = "BSON";
  // bson.addEventListener("click", async function() {
  //   accounts = await initAccounts();
  //   text.remove();
  //   this.remove();

  //   fill();
  // });

  // text.append("Import from ");
  // text.appendChild(json);
  // text.append(" or ")
  // text.appendChild(bson);
  // text.append(" file?");

  // body.appendChild(text);

  let popups = new PopupsDOM();
  body.appendChild(popups);

  for (let i = 0; i < accounts.length; i++) {
    let acc = new AccountDOM(accounts[i]);

    acc.addEventListener("gen-click", (e) => {
      const data = (e as CustomEvent<GeneratedButtonClick>).detail;

      popups.push(new Popup(data.website, data.password));
    });

    if (i % 2) {
      acc.style.backgroundColor = "#3f3f3f";
    }

    body.appendChild(acc);
  }

  // for (const acc of accounts) {
  //   body.appendChild(new AccountDOM(acc));
  // }
});
