use std::io;

use rand::prelude::*;
pub struct GeneratorManager {
    characters: Vec<char>,
    specials: Vec<(char, char)>,
    excludes: Vec<char>
}

impl GeneratorManager {
    pub fn new() -> GeneratorManager {
        let mut characters: Vec<char> = ('!'..'[').collect();
        characters.extend(']'..'~');

        GeneratorManager {
            characters: characters,
            specials: vec![
                ('!', '!'),
                ('#', '#'),
                (':', '@'),
                ('[', '^'),
                ('_', '`'),
                ('{', '~')
            ],
            excludes: Vec::new()
        }
    }

    pub fn set_excludes(&mut self, excludes: Vec<char>) {
        self.excludes = excludes;
    }

    fn check_char_in_range(&self, s: &str, start: char, end: char) -> bool {
        s.chars().any(|c| {
            if self.excludes.contains(&c) {
                return false;
            }
            c >= start && c <= end
        })
    }
    
    fn check_if_strong(&self, pass: &str, ranges: &[(char, char)]) -> bool {
        ranges.iter().all(|&(start, end)| self.check_char_in_range(pass, start, end)) &&
        self.specials.iter().any(|&(start, end)| self.check_char_in_range(pass, start, end))
    }
    
    pub fn generate_password(&self, n: u8) -> String {
        let mut rng = rand::rng();

        if n < 4 {
            return "Valid conditions: n > 3".to_string();
        }

        loop {
            let mut pass = String::new();
    
            for _i in 0..n {
                let index = rng.random_range(0..self.characters.len());
                let el = self.characters[index];
    
                pass.push(el);
            }
    
            let ranges = [
                ('a', 'z'),
                ('A', 'Z'),
                ('0', '9')
            ];

            if self.check_if_strong(&pass, &ranges) {
                return pass;
            }
        }
    }
}