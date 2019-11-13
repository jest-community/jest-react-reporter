import { AggregatedResult } from '@jest/test-result';
import { Config } from '@jest/types';
import { Context } from '@jest/reporters/build/types';
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
    const prefix = config.findRelatedTests
      ? 'related to files matching'
      : 'matching';

    return (
      <Box>
        <HorizontallyPadded>{prefix}</HorizontallyPadded>
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
      <LeftPadded>
        <Color dim>
          with tests matching &quot;{config.testNamePattern}&quot;
        </Color>
      </LeftPadded>
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
