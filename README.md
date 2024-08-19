# `jscpd-gitlab-reporter`

A [GitLab Code Quality](https://docs.gitlab.com/ee/ci/testing/code_quality.html) reporter for [jscpd](https://github.com/kucherenko/jscpd).

This uses the [custom tool approach](https://docs.gitlab.com/ee/ci/testing/code_quality.html#implement-a-custom-tool)
which is a subset of the [Code Climate spec](https://github.com/codeclimate/platform/blob/master/spec/analyzers/SPEC.md#data-types).

## Getting started

### Install

```bash
npm install jscpd-gitlab-reporter
```

### Usage

```bash
jscpd [...options] --reporters gitlab /path/to/source
```

See the [jspcd CLI docs](https://github.com/kucherenko/jscpd/tree/master/apps/jscpd) for available options and configuration.

### CI/CD Definition

Add the following to your `.gitlab-ci.yml`

```yaml
check:duplicates:
  image: node:20.14.0-alpine3.20
  stage: codequality
  script:
    - npm ci
    - npx jscpd --reporters gitlab src/**/*
  artifacts:
    reports:
      codequality: report/gl-codequality.json
```

## Additional Configuration

### `CI_PROJECT_DIR`

[Predefined GitLab CI variable](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) is used to determine
the relative file paths in the report. Defaults to the current working directory.

### `CODE_QUALITY_REPORT`
Specifies a custom report file path. Defaults to `gl-codequality.json` in the jscpd output directory, which itself
defaults to `report/`.

### `CODE_QUALITY_APPEND`
Merge the produced findings with an existing quality report if it already exists. Useful when utilising multiple tools
in the same GitLab job. Defaults to `false`.

---
[MIT](LICENSE) | Based on the [@jscpd/serif-reporter](https://github.com/kucherenko/jscpd/tree/master/packages/sarif-reporter) by Andrey Kucherenko
