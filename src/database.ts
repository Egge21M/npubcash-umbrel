import BetterSqliteDatabase from "better-sqlite3";

export interface Database {
  save: (query: string, parameters: any[]) => void;
  get: (query: string, parameters: any[]) => unknown[];
}
export class SqliteDatabase implements Database {
  private db: BetterSqliteDatabase.Database;
  static instance: SqliteDatabase;

  constructor(dbPath: string) {
    this.db = new BetterSqliteDatabase(dbPath);
    SqliteDatabase.instance = this;
  }
  static getInstance(dbFilePath: string): SqliteDatabase | null {
    if (!SqliteDatabase.instance) {
      if (!dbFilePath) {
        throw new Error("No instance setup yet");
      }
      SqliteDatabase.instance = new SqliteDatabase(dbFilePath);
    }
    return SqliteDatabase.instance;
  }
  save(query: string, parameters: any[]) {
    try {
      const statement = this.db.prepare(query);
      statement.run(parameters);
    } catch (e) {
      console.log(e);
      throw new Error("Failed to run query");
    }
  }
  get(query: string, parameters: any[]) {
    try {
      const statement = this.db.prepare(query);
      return statement.all(parameters);
    } catch (e) {
      console.log(e);
      throw new Error("Failed to run query");
    }
  }
}
