import { NCSDK } from "cashu-address-sdk";
import { TransactionDbStore } from "./store/TransactionDbStore";
import { ChangeDbStore } from "./store/ChangeDbStore";
import { Database } from "./database";

export class WalletController {
  balance: number;
  sdk: NCSDK;
  transactionStore: TransactionDbStore;
  changeStore: ChangeDbStore;

  constructor(db: Database) {
    this.changeStore = ChangeDbStore.init(db);
    this.transactionStore = TransactionDbStore.init(db);
  }

  async getBalance() {
    if (!this.sdk) {
      throw new Error("WalletController: SDK not available");
    }
    return await this.sdk.getBalance();
  }
}
