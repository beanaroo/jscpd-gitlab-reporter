import type { IClone } from "@jscpd/core";

type Severity = "info" | "minor" | "major" | "critical" | "blocker";

export type GitLabReportFinding = {
  severity: Severity;
  check_name: string;
  description: string;
  fingerprint: string;
  location: {
    path: string;
    lines: {
      begin: number;
    };
  };
};

export type Duplication = IClone["duplicationA"];
