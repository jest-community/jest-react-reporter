import * as path from 'path';
import * as React from 'react';
import { Box, Static, Text, TextProps, render, useApp, useStdout } from 'ink';
import slash = require('slash');
import type { Config } from '@jest/types';
import type { AggregatedResult, TestResult } from '@jest/test-result';
import {
  BaseReporter,
  Context,
  ReporterOnStartOptions,
  Test,
} from '@jest/reporters';
import { SnapshotStatus } from './SnapshotStatus';
import { Summary } from './Summary';
import { DisplayName, FormattedPath, ResultHeader, Runs } from './shared';
import { PostMessage } from './PostMessage';
import { VerboseTestList } from './VerboseTests';

type ConsoleBuffer = NonNullable<TestResult['console']>;
type LogType = ConsoleBuffer[0]['type'];

const TitleBullet = () => <Text bold>&#9679;</Text>;

const ColoredConsole: React.FC<
  Omit<TextProps, 'color'> & { type: LogType }
> = ({ type, ...props }: { type: LogType }) => (
  <Text
    color={type === 'warn' ? 'yellow' : type === 'error' ? 'red' : undefined}
    {...props}
  />
);

const TestConsoleOutput = ({
  console,
  verbose,
  cwd,
}: { console?: ConsoleBuffer } & Pick<Config.ProjectConfig, 'cwd'> &
  Pick<Config.GlobalConfig, 'verbose'>) => {
  if (!console || console.length === 0) {
    return null;
  }

  const TITLE_INDENT = verbose ? '\xa0'.repeat(2) : '\xa0'.repeat(4);
  const CONSOLE_INDENT = TITLE_INDENT + '\xa0'.repeat(2);

  const content = console.map(({ type, message, origin }, index) => {
    origin = slash(path.relative(cwd, origin));
    message = message
      .split(/\n/)
      .map(line => CONSOLE_INDENT + line)
      .join('\n');

    return (
      <Box key={index} flexDirection="column" paddingBottom={1}>
        <Box>
          {TITLE_INDENT}{' '}
          <ColoredConsole type={type} dimColor>
            console.
            {type}
          </ColoredConsole>{' '}
          <Text dimColor>{origin}</Text>
        </Box>
        <ColoredConsole type={type}>{message}</ColoredConsole>
      </Box>
    );
  });

  return (
    <Box flexDirection="column">
      <Box paddingBottom={1}>
        &nbsp;&nbsp;
        <TitleBullet /> Console:
      </Box>
      {content}
    </Box>
  );
};

const FailureMessage: React.FC<{
  failureMessage: string | null | undefined;
}> = ({ failureMessage }) => {
  if (failureMessage) {
    return <>{failureMessage.replace(/ /g, '\xa0')}</>;
  }

  return null;
};

const CompletedTests: React.FC<{
  completedTests: State['completedTests'];
  globalConfig: Config.GlobalConfig;
  summary: React.ReactElement;
  PostMessage: () => React.ReactElement;
  done: boolean;
}> = ({ completedTests, globalConfig, summary, PostMessage, done }) => {
  if (completedTests.length === 0) {
    return null;
  }
  const didUpdate = globalConfig.updateSnapshot === 'all';

  let testOutputs = completedTests.map(({ testResult, config }) => (
    <React.Fragment key={testResult.testFilePath + config.name}>
      <ResultHeader config={config} testResult={testResult} />
      <VerboseTestList testResult={testResult} globalConfig={globalConfig} />
      <TestConsoleOutput
        console={testResult.console}
        verbose={globalConfig.verbose}
        cwd={config.cwd}
      />
      <FailureMessage failureMessage={testResult.failureMessage} />
      <SnapshotStatus snapshot={testResult.snapshot} afterUpdate={didUpdate} />
    </React.Fragment>
  ));

  if (done) {
    testOutputs = testOutputs.concat(
      <Box paddingTop={1} key="summary">
        {summary}
      </Box>,
      <React.Fragment key="postmessage">
        <PostMessage />
      </React.Fragment>,
    );
  }

  return (
    <Box paddingBottom={1} flexDirection="column">
      <Static items={testOutputs}>{ele => ele}</Static>
    </Box>
  );
};

type DateEvents =
  | { type: 'TestStart'; payload: { test: Test } }
  | {
      type: 'TestResult';
      payload: {
        aggregatedResults: AggregatedResult;
        test: Test;
        testResult: TestResult;
      };
    }
  | { type: 'TestComplete'; payload: { contexts: Set<Context> } };

type Props = {
  register: (cb: (events: DateEvents) => void) => void;
  startingAggregatedResults: AggregatedResult;
  globalConfig: Config.GlobalConfig;
  options: ReporterOnStartOptions;
};

type State = {
  aggregatedResults: AggregatedResult;
  completedTests: Array<{
    testResult: TestResult;
    config: Config.ProjectConfig;
  }>;
  currentTests: Array<[Config.Path, Config.ProjectConfig]>;
  done: boolean;
  contexts: Set<Context>;
};

const reporterReducer: React.Reducer<State, DateEvents> = (
  prevState,
  action,
) => {
  switch (action.type) {
    case 'TestStart':
      return {
        ...prevState,
        currentTests: [
          ...prevState.currentTests,
          [action.payload.test.path, action.payload.test.context.config],
        ],
      };
    case 'TestResult': {
      const { aggregatedResults, test, testResult } = action.payload;
      const currentTests = prevState.currentTests.filter(
        ([testPath]) => test.path !== testPath,
      );
      return {
        ...prevState,
        aggregatedResults,
        completedTests: testResult.skipped
          ? prevState.completedTests
          : prevState.completedTests.concat({
              config: test.context.config,
              testResult,
            }),
        currentTests,
      };
    }
    case 'TestComplete': {
      return { ...prevState, done: true, contexts: action.payload.contexts };
    }
  }
};

const RunningTests: React.FC<{
  tests: State['currentTests'];
  width: number;
}> = ({ tests, width }) => {
  if (tests.length === 0) {
    return null;
  }

  return (
    <Box paddingBottom={1} flexDirection="column">
      {tests.map(([path, config]) => (
        <Box key={path + config.name}>
          <Runs />
          <DisplayName config={config} />
          <FormattedPath
            pad={8}
            columns={width}
            config={config}
            testPath={path}
          />
        </Box>
      ))}
    </Box>
  );
};

const Reporter: React.FC<Props> = ({
  register,
  globalConfig,
  options,
  startingAggregatedResults,
}) => {
  const [state, dispatch] = React.useReducer(reporterReducer, {
    aggregatedResults: startingAggregatedResults,
    completedTests: [],
    currentTests: [],
    done: false,
    contexts: new Set<Context>(),
  });

  React.useLayoutEffect(() => {
    register(dispatch);
  }, [register]);

  const { stdout } = useStdout();
  const width = stdout?.columns ?? 80;

  const { currentTests, completedTests, aggregatedResults, done, contexts } =
    state;
  const { estimatedTime = 0 } = options;

  const { exit } = useApp();
  React.useEffect(() => {
    if (done) {
      setImmediate(exit);
    }
  }, [done, exit]);

  const summary = (
    <Summary
      aggregatedResults={aggregatedResults}
      options={{ estimatedTime, roundTime: true, width }}
      done={done}
    />
  );
  return (
    <Box flexDirection="column">
      <CompletedTests
        completedTests={completedTests}
        globalConfig={globalConfig}
        summary={summary}
        done={done}
        PostMessage={() => (
          <PostMessage
            aggregatedResults={aggregatedResults}
            globalConfig={globalConfig}
            contexts={contexts}
          />
        )}
      />
      <RunningTests tests={currentTests} width={width} />
      {done ? null : summary}
    </Box>
  );
};

export default class ReactReporter extends BaseReporter {
  private _globalConfig: Config.GlobalConfig;
  private _components: Array<(events: DateEvents) => void>;
  private _waitUntilExit?: () => Promise<void>;

  constructor(globalConfig: Config.GlobalConfig) {
    super();
    this._globalConfig = globalConfig;
    this._components = [];
  }

  onRunStart(
    aggregatedResults: AggregatedResult,
    options: ReporterOnStartOptions,
  ) {
    // TODO: remove args after Jest 25 is published
    super.onRunStart(aggregatedResults, options);
    const { waitUntilExit } = render(
      <Reporter
        register={cb => this._components.push(cb)}
        startingAggregatedResults={aggregatedResults}
        options={options}
        globalConfig={this._globalConfig}
      />,
      // TODO: should respect `GlobalConfig.useStderr`? Jest itself does not: https://github.com/facebook/jest/issues/5064
      { experimental: true, stdout: process.stderr },
    );

    this._waitUntilExit = waitUntilExit;
  }

  onTestStart(test: Test) {
    this._components.forEach(cb =>
      cb({ payload: { test }, type: 'TestStart' }),
    );
  }

  onTestResult(
    test: Test,
    testResult: TestResult,
    aggregatedResults: AggregatedResult,
  ) {
    this._components.forEach(cb =>
      cb({
        payload: { aggregatedResults, test, testResult },
        type: 'TestResult',
      }),
    );
  }

  async onRunComplete(contexts: Set<Context>) {
    this._components.forEach(cb =>
      cb({ type: 'TestComplete', payload: { contexts } }),
    );
    if (this._waitUntilExit) {
      await this._waitUntilExit();
    }
  }
}
