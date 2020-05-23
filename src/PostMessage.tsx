import type { AggregatedResult } from '@jest/test-result';
import type { Config } from '@jest/types';
import type { Context } from '@jest/reporters';
import { testPathPatternToRegExp } from 'jest-util';
import * as React from 'react';
import { Box, Color, Text } from 'ink';

const LeftPadded: React.FC = ({ children }) => (
  <Box paddingLeft={1}>{children}</Box>
);

const HorizontallyPadded: React.FC = ({ children }) => (
  <Box paddingX={1}>{children}</Box>
);

const TestInfo: React.FC<{ config: Config.GlobalConfig }> = ({ config }) => {
  if (config.runTestsByPath) {
    return (
      <LeftPadded>
        <Color dim>within paths</Color>
      </LeftPadded>
    );
  }

  if (config.onlyChanged) {
    return (
      <LeftPadded>
        <Color dim>related to changed files</Color>
      </LeftPadded>
    );
  }

  if (config.testPathPattern) {
    return (
      <Box>
        <HorizontallyPadded>
          <Color dim>
            {config.findRelatedTests ? 'related to files matching' : 'matching'}
          </Color>
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
          <Color dim>with tests matching</Color>
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
          <Color dim>in</Color>
        </HorizontallyPadded>
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
  if (globalConfig.silent) {
    return null;
  }

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
