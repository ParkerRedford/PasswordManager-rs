use tauri::utils::acl::identifier;
use uuid::Uuid;
use sha2::{Sha256, Digest};
use bson::{doc, Bson, ser};
use std::{fs::File, io::{self, Read, Seek, SeekFrom}, mem};

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Metadata {
    pub offset: usize,
    pub next: usize,

    pub identifier: Uuid,
    pub hash: String,
}

impl Metadata {
    pub fn new(offset: usize, next_account: usize) -> Result<Metadata, io::Error> {
        let mut f = File::open("account.txt")?;
        f.seek(SeekFrom::Start(offset as u64))?;

        let mut buf = vec![0; get_total_size()];
        f.read_exact(&mut buf)?;

        Ok(bson::from_slice::<Metadata>(&buf).unwrap())

        // Ok(Metadata {
        //     offset: offset,
        //     identifier: uuid::Uuid::new_v4(),
        //     hash: "".to_owned(),
        //     next: next_account
        // })
    }

    

    pub fn init_for_write(&mut self) {
        self.next += ser::to_vec(&self).unwrap().len() * mem::size_of::<u8>();
    }
}

pub fn get(offset: usize) -> Result<Metadata, io::Error> {
    let mut f = File::open("account.txt")?;
    f.seek(SeekFrom::Start(offset as u64))?;

    let mut buf = vec![0; get_total_size()];
    f.read_exact(&mut buf)?;

    Ok(bson::from_slice::<Metadata>(&buf).unwrap())
}

pub fn get_total_size() -> usize {
    (mem::size_of::<usize>() * 2) + mem::size_of::<Uuid>() + 256
}