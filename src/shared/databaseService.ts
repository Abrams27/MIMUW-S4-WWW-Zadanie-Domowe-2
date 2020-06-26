import {asyncDbAll, asyncDbGet, asyncDbRun} from '@shared/databaseUtils';
import sqlite3 from 'sqlite3';
import {error} from 'winston';

export interface UserDB {
  id: number,
  username: string,
  password_hash: string,
  password_generation: number
}


export interface QuizShortDB {
  id: number,
  name: string
}

export interface QuizScoreShortDB {
  quiz_id: number
}

export interface QuizWithJsonDB {
  quiz: string
}

export interface QuizIdDB {
  id: number
}


export interface ScoreDB {
  score: number
}

export interface ScoreStatsDB {
  stats: string
}


class DatabaseService {

  private database = new sqlite3.Database('persistence/main.db');


  public async getUserWithName(username: string): Promise<UserDB> {
    return asyncDbGet(this.database, 'SELECT * FROM users WHERE username = ?', [username]);
  }

  public async updateUserPassword(username: string, hashedNewPassword: string, newPasswordGeneration: number): Promise<void> {
    return asyncDbRun(this.database, 'UPDATE users SET password_hash = ?, password_generation = ? WHERE username = ?',
        [hashedNewPassword, newPasswordGeneration, username]);
  }


  public async getAllQuizzesIdsAndNames(): Promise<QuizShortDB[]> {
    return asyncDbAll(this.database, 'SELECT id, name FROM quizzes');
  }

  public async getQuizWithName(quizName: string): Promise<QuizWithJsonDB> {
    return asyncDbGet(this.database, 'SELECT quiz FROM quizzes WHERE name = ?', [quizName]);
  }

  public async getQuizIdWithName(quizName: string): Promise<QuizIdDB> {
    return asyncDbGet(this.database, 'SELECT id FROM quizzes WHERE name = ?', [quizName]);
  }


  public async getSolvedQuizzesIdsByUser(userId: number): Promise<QuizScoreShortDB[]> {
    return asyncDbAll(this.database,  'SELECT quiz_id FROM scores WHERE user_id = ?', [userId]);
  }

  public async getAllScores(): Promise<ScoreDB[]> {
    return asyncDbAll(this.database, 'SELECT score FROM scores');
  }

  public async saveQuizScore(quizId: number, userId: number, quizScore: number, quizStats: string): Promise<void> {
    return asyncDbRun(this.database, 'INSERT INTO scores VALUES (4, ?, ?, ?, ?)', [quizId, quizScore, userId, quizStats])
  }

  public async getUserQuizScore(quizId: number, userId: number): Promise<ScoreStatsDB> {
    return asyncDbGet(this.database, 'SELECT stats FROM scores WHERE quiz_id = ? AND user_id = ?', [quizId, userId]);
  }

}

export const databaseService: DatabaseService = new DatabaseService();
