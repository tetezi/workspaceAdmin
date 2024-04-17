import { get } from "lodash";
import pkg from "../../package.json";
export const devMode = "development";
export const prodMode = "production";

export function getStorageName() {
  const title = getEnv("VITE_TITLE");
  return `${title}_${getEnvMode()}_${pkg.version}`;
}

export function getEnv(path: keyof ImportMetaEnvType): string {
  return get(import.meta.env, path);
}
export function getEnvMode(): string {
  return import.meta.env.MODE;
}
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
