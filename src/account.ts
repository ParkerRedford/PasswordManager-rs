import { invoke } from "@tauri-apps/api/core";

class Question {
    question: string;
    answer: string;

    constructor(question: string = "", answer: string = "") {
        this.question = question;
        this.answer = answer;
    }
}

class Account {
    id: string;
    website: string;
    username: string;
    password: string;
    password_hint: string;
    questions: Array<[string, string]> = [];
    notes: string;

    constructor(id: string, website: string, username: string, password: string, password_hint: string, questions: Array<[string, string]>, notes: string = "") {
        this.id = id;
        this.website = website;
        this.username = username;
        this.password = password;
        this.password_hint = password_hint;
        this.questions = questions;
        this.notes = notes;
    }

    saveUser(): Promise<boolean> {
        return invoke("saveUser", { user: this });
    }

    getUser(id: string): Promise<Account> {
        return invoke("get_user", { id: id });
    }

    generatePassword(n: number, excludes: string[]): Promise<string> {
        return invoke("generate_password", { n: n, excludes: excludes } );
    }
}

export class AccountDisplay extends HTMLDivElement {
    constructor(acc: Account) {
        super();

        let id = document.createElement("p");
        let website = document.createElement("p");
        let username = document.createElement("p");
        let password = document.createElement("p");
        let password_hint = document.createElement("p");
        let notes = document.createElement("p");

        id.innerHTML = `Uuid: ${acc.id}`;
        website.innerHTML = `Website: ${acc.website}`;
        username.innerHTML = `Username: ${acc.username}`;
        password.innerText = `Password: ${acc.password}`;
        password_hint.innerHTML = `Password Hint: ${acc.password_hint}`;
        notes.innerHTML = `Notes: ${acc.notes}`;

        let hasQ = acc.questions !== null;
        let qdiv = document.createElement("div");
        qdiv.style.flexDirection = "column";

        if (hasQ) {
            let text = document.createElement("p");
            text.innerHTML = "Questions:"
            qdiv.appendChild(text);

            let innerDiv = document.createElement("div");
            innerDiv.style.paddingLeft = "2rem";

            for (let [q, a] of acc.questions) {
                let qu = document.createElement("p");
                let an = document.createElement("p");

                qu.innerHTML = `Question: ${q}`;
                an.innerHTML = `Answer: ${a}`;

                innerDiv.append(qu, an);
            }
            qdiv.appendChild(innerDiv)
        }

        let copy = document.createElement("button");
        copy.innerHTML = "Copy"
        copy.addEventListener("click", function() {
            navigator.clipboard.writeText(acc.password);
        });

        let gen = document.createElement("button");
        gen.innerHTML = "Generate";
        gen.addEventListener("click", async function() {
            let p = await invoke<string>("pm_generate_password", { n: 12, excludes: [] } );
            acc.password = p;
            password.innerText = `Password: ${p}`;
        });

        this.append(id, website, username, password, password_hint);
        if (hasQ) {
            this.appendChild(qdiv);
        }
        this.append(notes, copy, gen);
    }
}

window.customElements.define('account-display', AccountDisplay, { extends: 'div' });

export async function initAccounts(): Promise<Array<Account>> {
    return await invoke<Array<Account>>("init_accounts");
}

export async function initAccountsJson(): Promise<Array<Account>> {
    return await invoke("init_accounts_json");
}