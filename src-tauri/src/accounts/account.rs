use std::io::{self, Read, Seek, SeekFrom, Write};
use std::fs::{self, metadata, File, OpenOptions};
use std::process::id;
use bson::{de, from_bson, doc, ser, Bson};
use std::mem;

use super::metadata::{MetaManager, Metadata};
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
    pub id: Uuid,
    pub website: String,
    pub username: String,
    pub password: String,
    pub password_hint: String,
    pub questions: Vec<Question>,
    pub notes: String
}

impl Account {
    fn new() -> Result<Account, io::Error> {
        let mut f = OpenOptions::new().write(true).append(true).open("accounts.dat")?;
        let offset = f.seek(SeekFrom::End(0))? as usize;

        let manager = p_generator::GeneratorManager::new();

        let acc = Account {
            id: uuid::Uuid::new_v4(),
            website: String::from("[website]"),
            username: String::from("[username]"),
            password: manager.generate_password(12),
            password_hint: String::from("[hint]"),
            questions: vec![],
            notes: String::from("[notes]")
        };

        let bytes = ser::to_vec(&acc).unwrap();
        metadata::Metadata::new(offset, acc.id, bytes.len())?;

        f.write_all(&bytes)?;

        metadata::Metadata::sort_indexes();

        Ok(acc)
    }

    fn save(&self, account: &mut Account) -> Result<(), io::Error> {
        let manager = MetaManager {};
        let meta = manager.get(account.id);

        let a = match meta {
            Ok(a) => a,
            Err(er) => {
                
            }
        };

        let mut f = File::open("accounts.dat")?;
        let offset = f.seek(SeekFrom::Start(0))? as usize;
        let next = -1;

        while next != 0 && offset <= f.metadata().unwrap().len() {
            let meta = metadata::get(account);
        }
        
        //Serialize account
        let bson_account = ser::to_vec(&account).unwrap();
        let bson_account_size = bson_account.len() * mem::size_of::<u8>();

        //Init and serialize metadata
        let mut metadata = metadata::Metadata::new(offset, account.id, bson_account_size)?;

        let bson_metadata = ser::to_vec(&metadata).unwrap();
        
        f.write_all(&bson_metadata)?;
        f.write_all(&bson_account)?;

        Ok(())
    }

    fn get(&self, id: Uuid) -> Result<Account, io::Error> {
        let mut f = File::open("accounts.dat")?;
        let s = f.seek(SeekFrom::Start(0))? as usize;
        
        let manager = MetaManager {};
        let meta = manager.get(id)?;

        let mut buf = vec![0; meta.size];
        f.seek(SeekFrom::Start(meta.offset as u64));
        f.read_exact(&mut buf)?;

        Ok(bson::from_slice::<Account>(&buf).unwrap())
    }
}

#[tauri::command]
fn init_accounts() -> Result<Vec<Account>, io::Error> {
    let contents = fs::read("accounts.dat")?;
    
    let doc = bson::from_slice(&contents).unwrap();
    let acc: Vec<Account> = from_bson(Bson::Document(doc)).unwrap();

    Ok(acc)
}