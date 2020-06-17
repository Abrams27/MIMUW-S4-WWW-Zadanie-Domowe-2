import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('persistence/main.db');

export function asyncDbGet(query: string, params?: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row)  => {
      if(err) {
        reject(new Error('Database error'));
      } else {
        resolve(row)
      }
    })
  })
}

export const asyncDbRun = async (query: string, params?: any[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(new Error('Database error.'));
      } else {
        resolve();
      }
    });
  });
};
