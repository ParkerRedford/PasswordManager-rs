import { invoke } from "@tauri-apps/api/core";

export interface Account {
    id: string;
    website: string;
    username: string;
    password: string;
    password_hint: string;
    questions: Array<[string, string]>;
    notes: string;
}

export interface GeneratedButtonClick {
    website: string,
    password: string
}

export class AccountDOM extends HTMLDivElement {
    account: Account;
    pass_len: number = 20;
    excludes: Array<string> = [];

    constructor(acc: Account) {
        super();
        this.account = acc;

        this.style.padding = "1rem";

        let id = document.createElement("p");
        id.classList.add("dotted-line");

        let website = document.createElement("p");
        website.classList.add("dotted-line");

        let username = document.createElement("p");
        username.classList.add("dotted-line");

        let pDiv = document.createElement("div");
        let password = document.createElement("p");
        pDiv.classList.add("dotted-line");
        pDiv.style.paddingBottom = "1rem";

        let password_hint = document.createElement("p");
        password_hint.classList.add("dotted-line");

        let notes = document.createElement("p");
        notes.classList.add("dotted-line");

        id.innerHTML = `Uuid: ${this.account.id}`;
        website.innerHTML = `Website: ${this.account.website}`;
        username.innerHTML = `Username: ${this.account.username}`;
        password.innerText = `Password: ${acc.password.replace(/./g, "*")}`;
        password_hint.innerHTML = `Password Hint: ${this.account.password_hint}`;
        notes.innerHTML = `Notes: ${this.account.notes}`;

        this.account.questions = acc.questions;
        let qDiv = document.createElement("div");
        qDiv.style.flexDirection = "column";
        qDiv.classList.add("dotted-line");

        let qs = document.createElement("p");
        qs.innerHTML = "Questions:"

        let qInnerDiv = document.createElement("div");
        qInnerDiv.style.paddingLeft = "2rem";
        qInnerDiv.style.paddingBottom = "2rem";

        if (this.account.questions === null) {
            this.account.questions = [];
        }

        for (let [q, a] of this.account.questions) {
            this.addQuestion([q, a], qInnerDiv);
        }
        
        let inputWrapper = document.createElement("div");
        let qas = document.createElement("div");

        let aInput = document.createElement("input");
        aInput.placeholder = "New Answer"
        let qInput = document.createElement("input");
        qInput.placeholder = "New Question";
        let add = document.createElement("button");
        add.innerHTML = "Add";

        add.addEventListener("click", () => {
            let nq: [string, string] = [qInput.value, aInput.value];
            this.account.questions.push(nq);

            this.addQuestion(nq, qas);

            aInput.value = '';
            qInput.value = '';
        });

        //Copy
        let copy = document.createElement("button");
        copy.innerHTML = "Copy"
        copy.addEventListener("click", () => {
            navigator.clipboard.writeText(this.account.password);
        });

        //Generate
        let gen = document.createElement("button");
        gen.innerHTML = "Generate";
        gen.addEventListener("click", async () => {
            let p = await invoke<string>("pm_generate_password", { n: this.pass_len, excludes: this.excludes } );
            this.account.password = p;
            password.innerText = `Password: ${p.replace(/./g, "*")}`;

            const data: GeneratedButtonClick = {
                website: this.account.website,
                password: this.account.password
            }

            let event = new CustomEvent("gen-click", {
                bubbles: true,
                detail: data
            });

            this.dispatchEvent(event);
        });

        inputWrapper.append(qInput, aInput, add);
        qInnerDiv.append(qas, inputWrapper);

        qDiv.append(qs, qInnerDiv);
        pDiv.append(password, copy, gen);
        this.append(id, website, username, pDiv, password_hint, qDiv, notes);
    }

    addQuestion(q: [string, string], qDiv: HTMLDivElement) {
        let qu = document.createElement("p");
        let an = document.createElement("p");

        qu.innerHTML = `Question: ${q[0]}`;
        an.innerHTML = `Answer: ${q[1]}`;

        let hr = document.createElement("hr");

        let btn = document.createElement("button");
        btn.innerHTML = "Remove";
        btn.addEventListener("click", () => {
            this.account.questions = this.account.questions.filter(qf => qf[0] !== q[0] && qf[1] !== q[1]);
            qu.remove();
            an.remove();
            btn.remove();
            hr.remove();
        });

        qDiv.append(qu, an, btn, hr);
    }

    getAccount(): Account {
        return this.account;
    }
}

window.customElements.define('account-display', AccountDOM, { extends: 'div' });

export async function initAccounts(): Promise<Array<Account>> {
    return await invoke<Array<Account>>("init_accounts");
}

export async function initAccountsJson(): Promise<Array<Account>> {
    return await invoke("init_accounts_json");
}