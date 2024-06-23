import { Response } from "express";

export function sendJsonError(res: Response, code: number, message: string) {
  res.status(code);
  return res.json({ error: true, message });
}
