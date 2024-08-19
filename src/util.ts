import crypto from "node:crypto";
import { relative } from "node:path";

import type { IOptions } from "@jscpd/core";
import type { Duplication } from "./types";

export function getPath(root: string, path: string, options: IOptions): string {
  return options.absolute ? path : relative(root, path);
}

export function describeLocation(
  path: string,
  { start, end }: Duplication,
): string {
  return `${path} [${start.line}:${start.column} - ${end.line}:${end.column}]`;
}

export function countLines({ start, end }: Duplication): number {
  return end.line - start.line;
}

export function hashFinding(duplications: string[]): string {
  const jsonStr = JSON.stringify(duplications);
  return crypto.createHash("sha256").update(jsonStr).digest("hex");
}
