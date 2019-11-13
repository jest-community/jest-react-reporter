import * as path from 'path';
import * as React from 'react';
import { Box, Color, ColorProps, Static, render, useApp, useStdout } from 'ink';
import slash from 'slash';
import { Config } from '@jest/types';
import { AggregatedResult, TestResult } from '@jest/test-result';
import { BaseReporter, ReporterOnStartOptions } from '@jest/reporters';
import { Context, Test } from '@jest/reporters/build/types';
import { SnapshotStatus } from './SnapshotStatus';
import { Summary } from './Summary';
import { DisplayName, FormattedPath, ResultHeader, Runs } from './shared';
import { PostMessage } from './PostMessage';

type ConsoleBuffer = NonNullable<TestResult['console']>;
type LogType = ConsoleBuffer[0]['type'];

const TitleBullet = () => <Color bold>&#9679;</Color>;

const ColoredConsole: React.FC<ColorProps & { type: LogType }> = ({
  type,
  ...props
}: {
  type: LogType;
}) => <Color yellow={type === 'warn'} red={type === 'error'} {...props} />;

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

  const content = console.map(({ type, message, origin }) => {
    origin = slash(path.relative(cwd, origin));
    message = message
      .split(/\n/)
      .map(line => CONSOLE_INDENT + line)
      .join('\n');

    return (
      <Box key={message} flexDirection="column" paddingBottom={1}>
        <Box>
          {TITLE_INDENT}{' '}
          <ColoredConsole type={type} dim>
            console.
            {type}
          </ColoredConsole>{' '}
          <Color dim>{origin}</Color>
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

const CompletedTests: React.FC<{
  completedTests: State['completedTests'];
  width: number;
  globalConfig: Config.GlobalConfig;
}> = ({ completedTests, width, globalConfig }) => {
  if (completedTests.length === 0) {
    return null;
  }
  const didUpdate = globalConfig.updateSnapshot === 'all';

  return (
    <Box paddingBottom={1} flexDirection="column">
      <Static>
        {completedTests.map(({ testResult, config }) => (
          <React.Fragment key={testResult.testFilePath + config.name}>
            <ResultHeader
              config={config || globalConfig}
              testResult={testResult}
              width={width}
            />
            <TestConsoleOutput
              console={testResult.console}
              verbose={globalConfig.verbose}
              cwd={config.cwd}
            />
            {testResult.failureMessage &&
              testResult.failureMessage.replace(/ /g, '\xa0')}
            <SnapshotStatus
              snapshot={testResult.snapshot}
              afterUpdate={didUpdate}
            />
          </React.Fragment>
        ))}
      </Static>
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
  const width = stdout.columns;

  const {
    currentTests,
    completedTests,
    aggregatedResults,
    done,
    contexts,
  } = state;
  const { estimatedTime = 0 } = options;

  const { exit } = useApp();
  React.useEffect(() => {
    if (done) {
      exit();
    }
  }, [done, exit]);

  return (
    <Box flexDirection="column">
      <CompletedTests
        completedTests={completedTests}
        width={width}
        globalConfig={globalConfig}
      />
      <RunningTests tests={currentTests} width={width} />
      <Summary
        aggregatedResults={aggregatedResults}
        options={{ estimatedTime, roundTime: true, width }}
        done={done}
      />
      {done ? (
        <PostMessage
          aggregatedResults={aggregatedResults}
          globalConfig={globalConfig}
          contexts={contexts}
        />
      ) : null}
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
      { experimental: true },
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
