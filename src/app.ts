import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { nip19 } from "nostr-tools";
import { sendJsonError } from "./general";
import { encrypt } from "nostr-tools/nip49";
import { AppControllerSingleton } from "./AppController";

const app = express();

app.use(bodyParser.json());

app.post("/setup", (req: Request, res: Response) => {
  if (AppControllerSingleton.getInstance().status !== "uninitialised") {
    return res.json({ error: true, message: "app is already instantiated" });
  }
  let sk: Uint8Array;
  const { nsec, passphrase } = req.body;
  if (!nsec || !passphrase) {
    return res.json({ error: true, message: "missing parameters" });
  }
  try {
    const result = nip19.decode(nsec as `nsec1${string}`);
    if (result.type !== "nsec") {
      throw new Error("nsec parameter is invalid");
    }
    sk = result.data;
  } catch (e) {
    console.log(e);
    return sendJsonError(res, 401, "invalid parameters");
  }
  const ncrypt = encrypt(sk, passphrase);
  AppControllerSingleton.getInstance().setup(ncrypt, passphrase);
  res.json({ error: false, data: ncrypt });
});

app.get("/balance", async (req: Request, res: Response) => {
  if (AppControllerSingleton.getInstance().status !== "ready") {
    return res.json({
      error: true,
      message: "app not initialised / unlocked yet",
    });
  }
  try {
    const balance =
      await AppControllerSingleton.getInstance().walletController.getBalance();
    return res.json({ error: false, data: balance });
  } catch (e) {
    return res.json({ error: true, message: e.message });
  }
});

app.get("/status", (req: Request, res: Response) => {
  res.json({ error: false, data: AppControllerSingleton.getInstance().status });
});

app.post("/unlock", (req: Request, res: Response) => {
  if (AppControllerSingleton.getInstance().status !== "locked") {
    res.json({
      error: true,
      message: `invalid app state: ${AppControllerSingleton.getInstance().status}`,
    });
  }
  const { passphrase } = req.body;
  console.log(passphrase);
  AppControllerSingleton.getInstance().unlock(passphrase);
  res.json({ error: false });
});

app.post("/setup", (req: Request, res: Response) => {
  const { ncrypt, passphrase } = req.body;
  try {
    AppControllerSingleton.getInstance().setup(ncrypt, passphrase);
    res.json({ error: false });
  } catch (e) {
    res.json({ error: true, message: e.messge });
  }
});

export default app;
