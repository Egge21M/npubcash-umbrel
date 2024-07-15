import { AppControllerSingleton } from "./AppController";
import { FileConfigController } from "./FileConfigController";
import { Ticker } from "./Ticker";
import { WalletController } from "./WalletController";
import app from "./app";
import "./database";
import { SqliteDatabase } from "./database";
import { ChangeDbStore } from "./store/ChangeDbStore";
import { TransactionDbStore } from "./store/TransactionDbStore";

const configController = new FileConfigController();
const db = new SqliteDatabase("test.db");
const walletController = new WalletController(db);
const ticker = new Ticker();
AppControllerSingleton.init(configController, walletController, ticker);

app.listen(8080);
