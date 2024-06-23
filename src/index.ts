import { AppControllerSingleton } from "./AppController";
import { FileConfigController } from "./FileConfigController";
import { WalletController } from "./WalletController";
import app from "./app";
import "./database";

const configController = new FileConfigController();
const walletController = new WalletController();
AppControllerSingleton.init(configController, walletController);

app.listen(8080);
