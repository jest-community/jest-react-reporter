import * as React from 'react';
import { Box, Color, ColorProps } from 'ink';
import type { TestResult } from '@jest/test-result';
import type { Config } from '@jest/types';
import chalk from 'chalk';
import slash from 'slash';
import { relativePath } from './utils';

export const Arrow: React.FC = () => <>{' \u203A '}</>;
export const Dot: React.FC = () => <>{' \u2022 '}</>;
export const DownArrow: React.FC = () => <>{' \u21B3 '}</>;

const pad = (string: string) => (chalk.supportsColor ? ` ${string} ` : string);

const PaddedColor: React.FC<ColorProps> = ({ children, ...props }) => (
  <Box paddingRight={1}>
    <Color {...props}>{children}</Color>
  </Box>
);

const Status: React.FC<ColorProps & { text: string }> = ({
  text,
  ...props
}) => (
  <PaddedColor inverse bold {...props}>
    {pad(text)}
  </PaddedColor>
);

const Fails: React.FC = () => <Status red text="FAIL" />;

const Pass: React.FC = () => <Status green text="PASS" />;

export const Runs: React.FC = () => <Status yellow text="RUNS" />;

export const DisplayName: React.FC<{
  config: Config.ProjectConfig;
}> = ({ config }) => {
  const { displayName } = config;
  if (!displayName) {
    return null;
  }

  if (typeof displayName === 'string') {
    return (
      <PaddedColor white inverse reset>
        {displayName}
      </PaddedColor>
    );
  }

  const { name, color } = displayName;

  return (
    <PaddedColor {...{ [color]: true }} inverse reset>
      {name}
    </PaddedColor>
  );
};

const TestStatus: React.FC<{ testResult: TestResult }> = ({ testResult }) => {
  if (testResult.skipped) {
    return null;
  }

  if (testResult.numFailingTests > 0 || testResult.testExecError) {
    return <Fails />;
  }

  return <Pass />;
};

export const ResultHeader: React.FC<{
  testResult: TestResult;
  config: Config.ProjectConfig;
}> = ({ testResult, config }) => (
  <Box>
    <TestStatus testResult={testResult} />
    <DisplayName config={config} />
    <FormatFullTestPath config={config} testPath={testResult.testFilePath} />
  </Box>
);

export const FormattedPath: React.FC<{
  pad: number;
  config: Config.ProjectConfig | Config.GlobalConfig;
  testPath: Config.Path;
  columns: number | undefined;
}> = ({ pad, config, testPath, columns }) => {
  const maxLength = (columns || Number.NaN) - pad;
  const relative = relativePath(config, testPath);
  const { basename } = relative;
  let { dirname } = relative;
  dirname = slash(dirname);

  // length is ok
  if (`${dirname}/${basename}`.length <= maxLength) {
    return (
      <>
        <Color dim>{dirname}/</Color>
        <Color bold>{basename}</Color>
      </>
    );
  }

  // we can fit trimmed dirname and full basename
  const basenameLength = basename.length;
  if (basenameLength + 4 < maxLength) {
    const dirnameLength = maxLength - 4 - basenameLength;
    dirname = `…${dirname.slice(
      dirname.length - dirnameLength,
      dirname.length,
    )}`;
    return (
      <>
        <Color dim>{dirname}/</Color>
        <Color bold>{basename}</Color>
      </>
    );
  }

  if (basenameLength + 4 === maxLength) {
    return (
      <>
        <Color dim>…/</Color>
        <Color bold>{basename}</Color>
      </>
    );
  }

  // can't fit dirname, but can fit trimmed basename
  return (
    <Color bold>
      …{basename.slice(basename.length - maxLength - 4, basename.length)}
    </Color>
  );
};

export const FormatFullTestPath: React.FC<{
  config: Config.GlobalConfig | Config.ProjectConfig;
  testPath: Config.Path;
}> = ({ config, testPath }) => (
  // TODO: maybe not 9000? We just don't want to trim it
  <FormattedPath config={config} testPath={testPath} pad={0} columns={9000} />
);
