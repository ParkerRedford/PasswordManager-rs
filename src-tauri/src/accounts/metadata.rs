use tauri::utils::acl::identifier;
use uuid::Uuid;
use sha2::{Sha256, Digest};
use bson::{doc, from_bson, from_slice, ser, Bson, Document};
use std::{fs::{File, OpenOptions}, io::{self, Read, Seek, SeekFrom, Write}, mem};

use super::account::Account;

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Metadata {
    pub offset: usize,
    pub size: usize,

    pub identifier: Uuid,
    //pub hash: String,
}

pub struct MetaManager {}

impl MetaManager {
    pub fn get(&self, id: Uuid) -> Result<Metadata, io::Error> {
        let mut f = File::open("accounts.di")?;
        let mut offset: usize = 0;

        const META_SIZE: usize = Metadata::get_total_size();

        loop {
            if offset >= f.metadata()?.len() as usize {
                return Err(io::Error::new(io::ErrorKind::NotFound, "Uuid not found"));
            }

            f.seek(SeekFrom::Start(offset as u64))?;

            let mut buf: [u8; META_SIZE] = [0; META_SIZE];

            f.read_exact(&mut buf)?;

            let doc = bson::from_slice(&buf).unwrap();
            let meta: Metadata = from_bson(Bson::Document(doc)).unwrap();

            if meta.identifier == id {
                return Ok(meta);
            } else {
                offset += META_SIZE;
            }
        }
    }

    pub fn sort_indexes() -> Result<(), io::Error> {
        let mut f = OpenOptions::new().read(true).write(true).open("accounts.di")?;

        //Sort



        Ok(())
    }
}

impl Metadata {
    pub fn new(offset: usize, id: Uuid, size: usize) -> Result<Metadata, io::Error> {
        let mut f = OpenOptions::new().write(true).append(true).open("accounts.di")?;   //di stands for data index        
        f.seek(SeekFrom::End(0))?;
        
        let meta = Metadata {
            identifier: id,
            offset: offset,
            size: size
        };
        
        let data = ser::to_vec(&meta).unwrap();
        f.write_all(&data)?;

        Ok(meta)
    }

    pub const fn get_total_size() -> usize {
        (mem::size_of::<usize>() * 2) + mem::size_of::<Uuid>()
    }
}
