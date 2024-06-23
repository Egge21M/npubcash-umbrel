import { NCSDK } from "cashu-address-sdk";

export class WalletController {
  balance: number;
  sdk: NCSDK;

  async getBalance() {
    if (!this.sdk) {
      throw new Error("WalletController: SDK not available");
    }
    return await this.sdk.getBalance();
  }
}
