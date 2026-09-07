import { type Browser } from "./types";

const globals = globalThis as typeof globalThis & {
	browser?: Browser;
	chrome?: Browser;
};

export const browser: Browser = globals.browser ?? globals.chrome ?? {};
