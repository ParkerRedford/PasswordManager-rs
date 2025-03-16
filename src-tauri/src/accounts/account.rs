use std::io::{self, Read, Seek, SeekFrom, Write};
use std::fs::{metadata, File};
use bson::{de, doc, ser, Bson};
use std::mem;

use super::metadata::Metadata;
use super::p_generator;
use super::metadata;

use uuid::Uuid;

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Question {
    question: String,
    answer: String
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Account {
    id: Uuid,
    website: String,
    username: String,
    password: String,
    questions: Vec<Question>,
    notes: String
}

impl Account {
    fn new() -> Account {
        let manager = p_generator::GeneratorManager::new();

        Account {
            website: String::from("Insert website"),
            username: String::from("Insert username"),
            password: manager.generate_password(12),
            questions: vec![],
            notes: String::from("")
        }
    }

    fn save_account(&self, account: &mut Account) -> Result<bool, io::Error> {
        let mut f = File::open("accounts.txt")?;
        let offset = f.seek(SeekFrom::Start(0))? as usize;
        let next = -1;

        while next != 0 {
            let meta = metadata::get(offset);

        }
        
        //Serialize account
        let bson_account = ser::to_vec(&account).unwrap();
        let bson_account_size = bson_account.len() * mem::size_of::<u8>();

        //Init and serialize metadata
        let mut metadata = metadata::Metadata::new(offset, bson_account_size);
        metadata.init_for_write();
        let bson_metadata = ser::to_vec(&metadata).unwrap();
        
        f.write_all(&bson_metadata);
        f.write_all(&bson_account);

        Ok(true)
    }

    fn get_account(&self, id: Uuid) -> Result<Account, io::Error> {
        let mut f = File::open("accounts.txt")?;
        let s = f.seek(SeekFrom::Start(0))? as usize;

        let meta = metadata::get(s)?;

        let mut buffer = vec![0; (meta - s) as usize];
        f.read_exact(&mut buffer)?;

        let deseralized_meta = bson::from_slice::<Metadata>(&buffer).unwrap();

        Ok(Account {
            website: String::from(""),
            username: String::from(""),
            password: String::from(""),
            questions: vec![],
            notes: String::from("")
        })
    }
}

#[tauri::command]
fn init_accounts() -> Vec<Account> {
    vec![]
}