import path from 'node:path'
import { createReadStream } from 'node:fs';
import { parse } from "csv-parse";
import Database from 'better-sqlite3';

const FILE_PATH = path.resolve('../out/data.csv');
const DATABASE_PATH = path.resolve('../database.sqlite');

const db = new Database(DATABASE_PATH);

const createUserTableQuery = db.prepare(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    document TEXT UNIQUE,
    email TEXT UNIQUE,
    phone TEXT
  )`);

createUserTableQuery.run();

const errors = [];

console.log('Start migration...');
createReadStream(FILE_PATH)
  .pipe(parse({
    delimiter: ',',
    trim: true,
    from_line: 2
  }))
  .on('data', (row) => {
    try {
      const [name, document, email, phone] = row;

      if (!name || !document || !email || !phone) {
        throw new Error('Invalid row');
      }

      const stmt = db.prepare(`
        INSERT INTO user (name, document, email, phone) 
        VALUES (@name, @document, @email, @phone)
      `);

      const result = stmt.run({
        name,
        document,
        email,
        phone
      });

      console.log('User inserted with id:', result.lastInsertRowid);
    } catch (error) {
      errors.push(error);
    }
  })
  .on('error', (error) => {
    console.error('Error', error.message);
  })
  .on('end', () => {
    console.log(`Migration finished with ${errors.length} errors.`);
    db.close();
  })
