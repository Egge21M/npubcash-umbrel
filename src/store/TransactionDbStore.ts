import { Database } from "../database";
import { Transaction } from "../types";

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
