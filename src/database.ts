import { Database as BetterSqliteDatabase } from "better-sqlite3";

interface Database {
  save: (query: string, parameters: any[]) => void;
  get: (query: string, parameters: any[]) => unknown[];
}
export class SqliteDatabase implements Database {
  private db: BetterSqliteDatabase;
  static instance: SqliteDatabase;

  constructor(db: BetterSqliteDatabase) {
    this.db = db;
    SqliteDatabase.instance = this;
  }
  static getInstance(db?: BetterSqliteDatabase): SqliteDatabase | null {
    if (!SqliteDatabase.instance) {
      if (!db) {
        throw new Error("No instance setup yet");
      }
      SqliteDatabase.instance = new SqliteDatabase(db);
    }
    return SqliteDatabase.instance;
  }
  save(query: string, parameters: any[]) {
    const statement = this.db.prepare(query);
    statement.run(parameters);
  }
  get(query: string, parameters: any[]) {
    const statement = this.db.prepare(query);
    return statement.all(parameters);
  }
}

export class TransactionDbStore {
  db: Database;
  static instance: TransactionDbStore;

  private constructor(db: Database) {
    this.db = db;
  }

  init(db: Database) {
    if (!TransactionDbStore.instance) {
      const newInstance = new TransactionDbStore(db);
    }
  }

  save(transaction: { data: string; timestamp: number }) {
    this.db.save("INSERT INTO transactions (data, timestamp) VALUES (?, ?)", [
      transaction.data,
      transaction.timestamp,
    ]);
  }
}
