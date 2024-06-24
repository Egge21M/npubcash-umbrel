import { Database as BetterSqliteDatabase } from "better-sqlite3";
import { Transaction } from "./types";

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

export class TransactionDbStore {
  db: Database;
  static instance: TransactionDbStore;

  private constructor(db: Database) {
    this.db = db;
  }

  init(db?: Database) {
    if (!TransactionDbStore.instance) {
      if (!db) {
        throw new Error(
          "store not initialised. pass db parameter to initialise one",
        );
      }
      TransactionDbStore.instance = new TransactionDbStore(db);
    }
    return TransactionDbStore.instance;
  }

  save(transaction: Transaction) {
    this.db.save(
      "INSERT INTO transactions (created_at, amount, status, payment_request, payment_hash) VALUES (?, ?, ?, ?, ?)",
      [
        transaction.created_at,
        transaction.amount,
        transaction.status,
        transaction.payment_request,
        transaction.payment_hash,
      ],
    );
  }
}
