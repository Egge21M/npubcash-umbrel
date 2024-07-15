import { decrypt } from "nostr-tools/nip49";
import { WalletController } from "./WalletController";
import { ConfigControllerInterface } from "./types";
import { NCSDK, NsecSigner } from "cashu-address-sdk";
import { TransactionDbStore } from "./store/TransactionDbStore";
import { ChangeDbStore } from "./store/ChangeDbStore";
import { Ticker } from "./Ticker";

export class AppControllerSingleton {
  private static instance: AppControllerSingleton;
  status: "startup" | "uninitialised" | "locked" | "ready" = "startup";
  configController: ConfigControllerInterface;
  walletController: WalletController;
  transactionStore: TransactionDbStore;
  changeStore: ChangeDbStore;
  ticker: Ticker;

  private constructor(
    configController: ConfigControllerInterface,
    walletController: WalletController,
    ticker: Ticker,
  ) {
    this.configController = configController;
    this.walletController = walletController;
    this.ticker = ticker;
  }

  static init(
    configController: ConfigControllerInterface,
    walletController: WalletController,
    ticker: Ticker,
  ) {
    if (!AppControllerSingleton.instance) {
      AppControllerSingleton.instance = new AppControllerSingleton(
        configController,
        walletController,
        ticker,
      );
    }
    const config =
      AppControllerSingleton.instance.configController.readConfig();
    if (config) {
      AppControllerSingleton.instance.status = "locked";
    } else {
      AppControllerSingleton.instance.status = "uninitialised";
    }
    return AppControllerSingleton.instance;
  }

  setup(ncrypt: string, passphrase: string) {
    if (this.status !== "uninitialised") {
      throw new Error("App is not uninitialised");
    }
    this.configController.setConfig({ method: "nsec", ncrypt });
    this.status = "locked";
    this.unlock(passphrase);
  }

  static getInstance() {
    if (!AppControllerSingleton.instance) {
      throw new Error(
        "AppController is not initialised yet. Call init() first",
      );
    }
    return AppControllerSingleton.instance;
  }

  unlock(passphrase: string) {
    const config = this.configController.readConfig();
    if (!config) {
      throw new Error("Config file was not found...");
    }
    const sk = decrypt(config.ncrypt, passphrase);
    const sdk = new NCSDK("https://npub.cash", new NsecSigner(sk));
    this.walletController.sdk = sdk;
    this.status = "ready";
    this.ticker.start(async () => {
      const balance = await this.walletController.getBalance();
      console.log(balance);
    });
  }
}
