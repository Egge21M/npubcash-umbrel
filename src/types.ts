import { Proof } from "@cashu/cashu-ts";

export type Config = {
  method: "nsec";
  ncrypt: string;
};

export interface ConfigControllerInterface {
  config: Config;
  readConfig: () => Config | undefined;
  setConfig: (c: Config) => void;
}

export type Transaction = {
  created_at: number;
  amount: number;
  status: "pending" | "successfull" | "failed";
  payment_request: string;
  payment_hash: string;
};

export type Change = {
  created_at: number;
  id: string;
  amount: number;
  secret: string;
  C: string;
};
