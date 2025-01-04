import { type CssUnit } from "./types";

export const parseCssUnit = (unit: CssUnit): string =>
	typeof unit === "string" ? unit : `${unit}px`;
