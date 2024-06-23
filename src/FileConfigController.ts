import { readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { Config, ConfigControllerInterface } from "./types";

export class FileConfigController implements ConfigControllerInterface {
  filePath = join(homedir(), ".config/config.json");
  config: Config;

  readConfig(): Config | undefined {
    try {
      const f = readFileSync(this.filePath);
      const parsedConfig = JSON.parse(f.toString());
      this.config = parsedConfig;
      return parsedConfig;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
  setConfig(c: Config) {
    writeFileSync(this.filePath, JSON.stringify(c));
  }
}
