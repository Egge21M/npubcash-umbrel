export type Config = {
  method: "nsec";
  ncrypt: string;
};

export interface ConfigControllerInterface {
  config: Config;
  readConfig: () => Config | undefined;
  setConfig: (c: Config) => void;
}
