import type { AggregatedResult } from '@jest/test-result';
import type { Config } from '@jest/types';
import type { TestContext } from '@jest/reporters';
import { testPathPatternToRegExp } from 'jest-util';
import * as React from 'react';
import { Box, Text } from 'ink';

const LeftPadded: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box paddingLeft={1}>{children}</Box>
);

const HorizontallyPadded: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Box paddingX={1}>{children}</Box>;

const TestInfo: React.FC<{ config: Config.GlobalConfig }> = ({ config }) => {
  if (config.runTestsByPath) {
    return (
      <LeftPadded>
        <Text dimColor>within paths</Text>
      </LeftPadded>
    );
  }

  if (config.onlyChanged) {
    return (
      <LeftPadded>
        <Text dimColor>related to changed files</Text>
      </LeftPadded>
    );
  }

  if (config.testPathPattern) {
    return (
      <Box>
        <HorizontallyPadded>
          <Text dimColor>
            {config.findRelatedTests ? 'related to files matching' : 'matching'}
          </Text>
        </HorizontallyPadded>
        <Text>
          {testPathPatternToRegExp(config.testPathPattern).toString()}
        </Text>
      </Box>
    );
  }

  return null;
};

const NameInfo: React.FC<{ config: Config.GlobalConfig }> = ({ config }) => {
  if (config.runTestsByPath) {
    return <Text> {config.nonFlagArgs.map(p => `"${p}"`).join(', ')}</Text>;
  }

  if (config.testNamePattern) {
    return (
      <>
        <HorizontallyPadded>
          <Text dimColor>with tests matching</Text>
        </HorizontallyPadded>
        <Text>&quot;{config.testNamePattern}&quot;</Text>
      </>
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
        <HorizontallyPadded>
          <Text dimColor>in</Text>
        </HorizontallyPadded>
        <Text>{numberOfContexts}</Text>
        <Text dimColor> projects</Text>
      </>
    );
  }

  return null;
};

export const PostMessage: React.FC<{
  aggregatedResults: AggregatedResult;
  globalConfig: Config.GlobalConfig;
  contexts: Set<TestContext>;
}> = ({ aggregatedResults, globalConfig, contexts }) => {
  if (globalConfig.silent) {
    return null;
  }

  if (aggregatedResults.wasInterrupted) {
    return (
      <Text bold color="red">
        Test run was interrupted.
      </Text>
    );
  }

  return (
    <Box>
      <Text dimColor>Ran all test suites</Text>
      <TestInfo config={globalConfig} />
      <NameInfo config={globalConfig} />
      <ContextInfo numberOfContexts={contexts.size} />
      <Text dimColor>.</Text>
    </Box>
  );
};
