import * as React from 'react';
import { Box, Text, TextProps } from 'ink';
import type { TestResult } from '@jest/test-result';
import type { Config } from '@jest/types';
import chalk = require('chalk');
import slash = require('slash');
import { relativePath } from './utils';

export const Arrow: React.FC = () => <>{' \u203A '}</>;
export const Dot: React.FC = () => <>{' \u2022 '}</>;
export const DownArrow: React.FC = () => <>{' \u21B3 '}</>;

const pad = (string: string) => (chalk.supportsColor ? ` ${string} ` : string);

const PaddedText: React.FC<TextProps> = ({ children, ...props }) => (
  <Box paddingRight={1}>
    <Text {...props}>{children}</Text>
  </Box>
);

const Status: React.FC<TextProps & { text: string }> = ({ text, ...props }) => (
  <PaddedText inverse bold {...props}>
    {pad(text)}
  </PaddedText>
);

const Fails: React.FC = () => <Status color="red" text="FAIL" />;

const Pass: React.FC = () => <Status color="green" text="PASS" />;

export const Runs: React.FC = () => <Status color="yellow" text="RUNS" />;

export const DisplayName: React.FC<{
  config: Config.ProjectConfig;
}> = ({ config }) => {
  const { displayName } = config;
  if (!displayName) {
    return null;
  }

  if (typeof displayName === 'string') {
    return (
      <PaddedText color="white" inverse>
        {displayName}
      </PaddedText>
    );
  }

  const { name, color } = displayName;

  return (
    <PaddedText color={color} inverse>
      {name}
    </PaddedText>
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
  testPath: string;
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
        <Text dimColor>{dirname}/</Text>
        <Text bold>{basename}</Text>
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
        <Text dimColor>{dirname}/</Text>
        <Text bold>{basename}</Text>
      </>
    );
  }

  if (basenameLength + 4 === maxLength) {
    return (
      <>
        <Text dimColor>…/</Text>
        <Text bold>{basename}</Text>
      </>
    );
  }

  // can't fit dirname, but can fit trimmed basename
  return (
    <Text bold>
      …{basename.slice(basename.length - maxLength - 4, basename.length)}
    </Text>
  );
};

export const FormatFullTestPath: React.FC<{
  config: Config.GlobalConfig | Config.ProjectConfig;
  testPath: string;
}> = ({ config, testPath }) => (
  // TODO: maybe not 9000? We just don't want to trim it
  <FormattedPath config={config} testPath={testPath} pad={0} columns={9000} />
);
