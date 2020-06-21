import {asyncDbAll, asyncDbGet, asyncDbRun} from '@shared/databaseUtils';
import sqlite3 from 'sqlite3';
import {error} from 'winston';

class DatabaseService {

  private database = new sqlite3.Database('persistence/main.db');

  public async getUserWithName(username: string): Promise<any> {
    return asyncDbGet(this.database, 'SELECT * FROM users WHERE username = ?', [username]);
  }

  public async updateUserPassword(username: string, hashedNewPassword: string, newPasswordGeneration: number): Promise<void> {
    return asyncDbRun(this.database, 'UPDATE users SET password_hash = ?, password_generation = ? WHERE username = ?',
        [hashedNewPassword, newPasswordGeneration, username]);
  }


  public async getAllQuizzesIdsAndNames(): Promise<any[]> {
    return asyncDbAll(this.database, 'SELECT id, name FROM quizzes');
  }

  public async getSolvedQuizzesIdsByUser(userId: number): Promise<any[]> {
    return asyncDbAll(this.database,  'SELECT quiz_id FROM scores WHERE user_id = ?', [userId]);
  }

  public async getAllScores(): Promise<any[]> {
    return asyncDbAll(this.database, 'SELECT score FROM scores');
  }

  public async getQuizWithName(quizName: string): Promise<any> {
    return asyncDbGet(this.database, 'SELECT quiz FROM quizzes WHERE name = ?', [quizName]);
  }

  public async getQuizIdWithName(quizName: string): Promise<any> {
    return asyncDbGet(this.database, 'SELECT id FROM quizzes WHERE name = ?', [quizName]);
  }

  public async saveQuizScore(quizId: number, userId: number, quizScore: number, quizStats: string): Promise<void> {
    return asyncDbRun(this.database, 'INSERT INTO scores VALUES (4, ?, ?, ?, ?)', [quizId, quizScore, userId, quizStats])
  }

  public async getUserQuizScore(quizId: number, userId: number): Promise<any> {
    return asyncDbGet(this.database, 'SELECT stats FROM scores WHERE quiz_id = ? AND user_id = ?', [quizId, userId]);
  }
}

export const databaseService: DatabaseService = new DatabaseService();
