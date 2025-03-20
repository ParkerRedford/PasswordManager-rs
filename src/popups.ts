export class Popup extends HTMLDivElement {
    constructor(website: string, pass: string) {
        super();

        this.style.position = "relative";
        this.style.margin = "0.5rem";
        this.style.padding = "1rem";
        this.style.backgroundColor = "grey";
        this.style.borderRadius = "1rem";

        let close = document.createElement("button");
        close.style.position = "absolute";
        close.style.top = "0";
        close.style.right = "0";
        close.style.width = "auto";
        close.style.margin = "1rem";

        close.innerHTML = "X";
        close.addEventListener("click", () => {
            this.remove();
        });

        let p = document.createElement("p");
        p.innerHTML = `New password`;
        p.style.marginTop = "0";

        let wp = document.createElement("p");
        wp.innerText = `Website: ${website}\nPassword: ${pass}`;
        wp.style.marginBottom = "0";

        let dateDom = document.createElement("p");
        dateDom.innerText = new Date().toLocaleTimeString();

        this.append(close, p, dateDom, wp);

        setTimeout(() => {
            this.remove();
        }, 30 * 1000);
    }
}

export class PopupsDOM extends HTMLDivElement {
    constructor() {
        super();

        this.style.position = "fixed";
        this.style.top = "0";
        this.style.right = "0";
        this.style.margin = "0";
    }

    push(pop: Popup) {
        this.appendChild(pop);
    }
}

window.customElements.define("popups-dom", PopupsDOM, { extends: 'div' });
window.customElements.define('popup-el', Popup, { extends: 'div' });