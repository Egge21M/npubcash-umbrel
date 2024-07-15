import { AppControllerSingleton } from "./AppController";
import { FileConfigController } from "./FileConfigController";
import { WalletController } from "./WalletController";
import app from "./app";
import "./database";
import { SqliteDatabase } from "./database";
import { ChangeDbStore } from "./store/ChangeDbStore";
import { TransactionDbStore } from "./store/TransactionDbStore";

const configController = new FileConfigController();
const walletController = new WalletController();
const db = new SqliteDatabase("test.db");
const transactionStore = TransactionDbStore.init(db);
const changeStore = ChangeDbStore.init(db);
AppControllerSingleton.init(
  configController,
  walletController,
  transactionStore,
  changeStore,
);

app.listen(8080);
