import Database from 'better-sqlite3';

const DATABASE_PATH = path.resolve('../database.sqlite');

export const db = new Database(DATABASE_PATH);

/**
 * Create user table if not exists
 * 
 * @returns {import('better-sqlite3').RunResult}
 */
export function createUserTable() {
  const createUserTableQuery = db.prepare(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    document TEXT UNIQUE,
    email TEXT UNIQUE,
    phone TEXT
  )`);

  return createUserTableQuery.run();
}

/**
 * Insert new user
 * 
 * @typedef UserValues
 * @property {string} name
 * @property {string} document
 * @property {string} email
 * @property {string} phone
 * 
 * @param {UserValues} values 
 * @returns {import('better-sqlite3').RunResult}
 */
export function insertUser(values) {
  const { name, document, email, phone } = values;

  if (!name || !document || !email || !phone) {
    throw new Error('Invalid row');
  }

  const stmt = db.prepare(`
    INSERT INTO user (name, document, email, phone) 
    VALUES (@name, @document, @email, @phone)
  `);

  return stmt.run({
    name,
    document,
    email,
    phone
  });
}