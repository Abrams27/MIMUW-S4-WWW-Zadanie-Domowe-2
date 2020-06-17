import sqlite3 from 'sqlite3'
import {hashPassword} from './src/shared/hashUtils';

const db = new sqlite3.Database('persistence/main.db');

db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password_hash TEXT, password_generation INTEGER)');
  db.run('INSERT INTO users VALUES (1, ?, ?, 0)', ['user1', hashPassword('user1')]);
  db.run('INSERT INTO users VALUES (2, ?, ?, 0)', ['user2', hashPassword('user2')]);
});
