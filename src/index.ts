import { dirname, join } from "node:path";
import { cwd } from "node:process";

import type { IClone, IOptions } from "@jscpd/core";
import type { IReporter } from "@jscpd/finder";
import type { GitLabReportFinding } from "./types";

import {
  ensureDirSync,
  pathExistsSync,
  readJsonSync,
  writeFileSync,
} from "fs-extra";
import { green } from "colors/safe";
import { getPath, describeLocation, countLines, hashFinding } from "./util";

export default class GitLabReporter implements IReporter {
  constructor(private options: IOptions) {}

  public report(clones: IClone[]): void {
    if (this.options.output) {
      const {
        CI_PROJECT_DIR = cwd(),
        CODE_QUALITY_APPEND = false,
        CODE_QUALITY_REPORT = join(this.options.output, "gl-codequality.json"),
      } = process.env;

      const issues: GitLabReportFinding[] = clones.map(
        ({ duplicationA, duplicationB }) => {
          const pathA = getPath(CI_PROJECT_DIR, duplicationA.sourceId, this.options);
          const locationA = describeLocation(pathA, duplicationA);
          const pathB = getPath(CI_PROJECT_DIR, duplicationB.sourceId, this.options);
          const locationB = describeLocation(pathB, duplicationB);

          return {
            check_name: "jscpd/duplication",
            categories: ["Duplication"],
            severity: "minor",
            description: `${countLines(duplicationA)} lines of code duplicated at ${locationB}`,
            fingerprint: hashFinding([locationA, locationB]),
            location: {
              path: pathA,
              lines: {
                begin: duplicationA.start.line,
              },
            },
          };
        },
      );

      const reportPath = CODE_QUALITY_REPORT;
      ensureDirSync(dirname(reportPath));
      if (CODE_QUALITY_APPEND === "true" && pathExistsSync(reportPath)) {
        const existingIssues = readJsonSync(reportPath);
        issues.push(existingIssues);
      }
      writeFileSync(reportPath, JSON.stringify(issues, null, 2));

      console.log(green(`GitLab Code Quality report saved to ${reportPath}`));
    }
  }
}
