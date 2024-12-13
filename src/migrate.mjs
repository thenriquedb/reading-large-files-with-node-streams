import path from 'node:path'
import { createReadStream } from 'node:fs';
import { parse } from "csv-parse";
import { createUserTable, db, insertUser } from './database.mjs';
const CSV_FILE_PATH = path.resolve('../out/data.csv');

createUserTable();

const errors = [];

console.log('Start migration...');
createReadStream(CSV_FILE_PATH)
  .pipe(
    parse({
      delimiter: ',',
      trim: true,
      from_line: 2
    }))
  .on('data', (row) => {
    try {
      const [name, document, email, phone] = row;

      const result = insertUser({
        name,
        document,
        email,
        phone
      })

      // console.log('User inserted with id:', result.lastInsertRowid);
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
