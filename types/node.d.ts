declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}
declare var process: {
  env: NodeJS.ProcessEnv;
  argv: string[];
  exit(code?: number): void;
};
export {};
