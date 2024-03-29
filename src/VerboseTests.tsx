import * as React from 'react';
import { Box, Text } from 'ink';
import type { Config } from '@jest/types';
import type { AssertionResult, Suite, TestResult } from '@jest/test-result';
import { VerboseReporter } from '@jest/reporters';
import { specialChars } from 'jest-util';

const { ICONS } = specialChars;

const Status: React.FC<{ status: AssertionResult['status'] }> = ({
  status,
}) => {
  if (status === 'failed') {
    return <Text color="red">{ICONS.failed}</Text>;
  }
  if (status === 'pending') {
    return <Text color="yellow">{ICONS.pending}</Text>;
  }
  if (status === 'todo') {
    return <Text color="magenta">{ICONS.todo}</Text>;
  }
  return <Text color="green">{ICONS.success}</Text>;
};

const TestLine: React.FC<{ test: AssertionResult; indentation: number }> = ({
  test,
  indentation,
}) => (
  <Box paddingLeft={indentation}>
    <Box paddingRight={1}>
      <Status status={test.status} />
    </Box>
    <Text dimColor>{test.title}</Text>
    {test.duration ? (
      <Box paddingLeft={1}>
        <Text dimColor>({test.duration.toFixed(0)}ms)</Text>
      </Box>
    ) : null}
  </Box>
);
const NotExpandedTestLine: React.FC<{
  test: AssertionResult;
  indentation: number;
}> = ({ test, indentation }) => (
  <Box paddingLeft={indentation}>
    <Box paddingRight={1}>
      <Status status={test.status} />
    </Box>
    <Text dimColor>
      {test.status === 'pending' ? 'skipped' : test.status} {test.title}
    </Text>
  </Box>
);

const TestsLog: React.FC<{
  tests: Suite['tests'];
  indendation: number;
  expand: boolean;
}> = ({ tests, expand, indendation }) => {
  if (expand) {
    return (
      <>
        {tests.map((test, i) => (
          <TestLine key={i} test={test} indentation={indendation} />
        ))}
      </>
    );
  }

  const summedTests = tests.reduce<{
    pending: Suite['tests'];
    todo: Suite['tests'];
    render: Suite['tests'];
  }>(
    (result, test) => {
      if (test.status === 'pending') {
        result.pending.push(test);
      } else if (test.status === 'todo') {
        result.todo.push(test);
      } else {
        result.render.push(test);
      }

      return result;
    },
    { pending: [], todo: [], render: [] },
  );

  return (
    <Box flexDirection="column">
      {summedTests.render.map((test, i) => (
        <TestLine key={i} test={test} indentation={indendation} />
      ))}
      {summedTests.pending.map((test, i) => (
        <NotExpandedTestLine
          key={`pending${i}`}
          test={test}
          indentation={indendation}
        />
      ))}
      {summedTests.todo.map((test, i) => (
        <NotExpandedTestLine
          key={`pending${i}`}
          test={test}
          indentation={indendation}
        />
      ))}
    </Box>
  );
};

const SuiteLog: React.FC<{
  indendation: number;
  suite: Suite;
  globalConfig: Config.GlobalConfig;
}> = ({ globalConfig, indendation, suite }) => {
  const newIndentation = indendation + 1;

  return (
    <Box paddingLeft={indendation} flexDirection="column">
      {suite.title ? <Text>{suite.title}</Text> : null}

      <TestsLog
        tests={suite.tests}
        indendation={newIndentation}
        expand={globalConfig.expand}
      />
      {suite.suites.map((inner, i) => (
        <SuiteLog
          key={i}
          globalConfig={globalConfig}
          indendation={newIndentation}
          suite={inner}
        />
      ))}
    </Box>
  );
};

export const VerboseTestList: React.FC<{
  testResult: TestResult;
  globalConfig: Config.GlobalConfig;
}> = ({ testResult, globalConfig }) => {
  if (!globalConfig.verbose) {
    return null;
  }

  const groupedTests = VerboseReporter.groupTestsBySuites(
    testResult.testResults,
  );

  return (
    <SuiteLog
      suite={groupedTests}
      indendation={0}
      globalConfig={globalConfig}
    />
  );
};
