import { AggregatedResult } from '@jest/test-result';
import { Config } from '@jest/types';
import { Context } from '@jest/reporters/build/types';
import { testPathPatternToRegExp } from 'jest-util';
import * as React from 'react';
import { Box, Color, Text } from 'ink';

const TestInfo: React.FC<{ config: Config.GlobalConfig }> = ({ config }) => {
  if (config.runTestsByPath) {
    return <Color dim> within paths</Color>;
  }

  if (config.onlyChanged) {
    return <Color dim> related to changed files</Color>;
  }
  const prefix = config.findRelatedTests
    ? ' related to files matching '
    : ' matching ';

  return (
    <Box>
      <Color dim>{prefix}</Color>
      <Text>{testPathPatternToRegExp(config.testPathPattern).toString()}</Text>
    </Box>
  );
};

const NameInfo: React.FC<{ config: Config.GlobalConfig }> = ({ config }) => {
  if (config.runTestsByPath) {
    return <Text> {config.nonFlagArgs.map(p => `"${p}"`).join(', ')}</Text>;
  }

  if (config.testNamePattern) {
    return (
      <Color dim>
        {' '}
        with tests matching &quot;{config.testNamePattern}&quot;
      </Color>
    );
  }

  return null;
};

const ContextInfo: React.FC<{ numberOfContexts: number }> = ({
  numberOfContexts,
}) => {
  if (numberOfContexts > 1) {
    return (
      <>
        <Color dim> in </Color>
        <Text>{numberOfContexts}</Text>
        <Color dim> projects</Color>
      </>
    );
  }

  return null;
};

export const PostMessage: React.FC<{
  aggregatedResults: AggregatedResult;
  globalConfig: Config.GlobalConfig;
  contexts: Set<Context>;
}> = ({ aggregatedResults, globalConfig, contexts }) => {
  if (aggregatedResults.wasInterrupted) {
    return (
      <Color bold red>
        Test run was interrupted.
      </Color>
    );
  }

  return (
    <Box>
      <Color dim>Ran all test suites</Color>
      <TestInfo config={globalConfig} />
      <NameInfo config={globalConfig} />
      <ContextInfo numberOfContexts={contexts.size} />
      <Color dim>.</Color>
    </Box>
  );
};
