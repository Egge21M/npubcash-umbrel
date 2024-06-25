type Invoice = {
  amount: number;
  paymentRequest: string;
  paymentHash: string;
};

interface LightningInterface {
  getInvoice: (amount: number) => Promise<Invoice>;
  checkInvoiceState: (invoice: Invoice) => Promise<string>;
}

interface LightningAdapter {
  getInvoice: (amount: number) => Promise<Invoice>;
  checkInvoiceState: (invoice: Invoice) => Promise<string>;
}

export class LNDUmbrelAdapter {
  getInvoice: (amount: number) => Promise<Invoice>;
  checkInvoiceState: (invoice: Invoice) => Promise<string>;
}

export class LNDController implements LightningInterface {
  private adapter: LightningAdapter;
  private static instance: LNDController;

  private constructor(adapter: LightningAdapter) {
    this.adapter = adapter;
  }
  async getInvoice(amount: number): Promise<Invoice> {
    return this.adapter.getInvoice(amount);
  }
  async checkInvoiceState(invoice: Invoice): Promise<string> {
    return this.adapter.checkInvoiceState(invoice);
  }
  static getInstance(adapter?: LightningAdapter) {
    if (!this.instance) {
      if (!adapter) {
        throw new Error("Controller not initialsied yet...");
      }
      LNDController.instance = new LNDController(adapter);
    }
    return LNDController.instance;
  }
}
