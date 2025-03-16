import { invoke } from "@tauri-apps/api/core";

class Question {
    question: string;
    answer: string;

    constructor(question: string = "", answer: string = "") {
        this.question = question;
        this.answer = answer;
    }
}

class User {
    id: string;
    website: string;
    username: string;
    password: string;
    questions: Array<Question>;
    notes: string;

    constructor(id: string, website: string, username: string, password: string, question: Array<Question>, notes: string = "") {
        this.id = id;
        this.website = website;
        this.username = username;
        this.password = password;
        this.questions = question;
        this.notes = notes;
    }

    saveUser(): Promise<boolean> {
        return invoke("saveUser", { user: this });
    }

    getUser(id: string): Promise<User> {
        return invoke("get_user", { id: id });
    }

    generatePassword(n: number): Promise<string> {
        return invoke("generate_password", { n: n } );
    }
}

function initUsers(): Promise<Array<User>> {
    return invoke("init_users");
}