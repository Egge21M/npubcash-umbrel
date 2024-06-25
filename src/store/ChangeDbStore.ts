import { Database } from "../database";
import { Change } from "../types";

export class ChangeDbStore {
  db: Database;
  static instance: ChangeDbStore;

  private constructor(db: Database) {
    this.db = db;
  }

  static init(db?: Database) {
    if (!ChangeDbStore.instance) {
      if (!db) {
        throw new Error(
          "store not initialised. pass db paramtere to initialise one",
        );
      }
      ChangeDbStore.instance = new ChangeDbStore(db);
    }
    return ChangeDbStore.instance;
  }

  save(change: Change) {
    this.db.save(
      "INSERT INTO change (created_at, proof_id, amount, secret, C) VALUES (?, ?, ?, ?, ?)",
      [change.created_at, change.id, change.amount, change.secret, change.C],
    );
  }
  getAll() {
    return this.db.get("SELECT * FROM change", []);
  }
}
