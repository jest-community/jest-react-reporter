import { SummaryOptions } from '@jest/reporters/build/types';
import { AggregatedResult } from '@jest/test-result';
import { pluralize } from 'jest-util';
import * as React from 'react';
import { Box, Color, Text } from 'ink';
import { useCounter } from './utils';

const PROGRESS_BAR_WIDTH = 40;

const SummaryHeading: React.FC = ({ children }) => (
  <Box width={13}>
    <Text bold>{children}:</Text>
  </Box>
);

export const Summary: React.FC<{
  aggregatedResults: AggregatedResult;
  done: boolean;
  options?: SummaryOptions;
}> = ({ aggregatedResults, done, options }) => {
  const { startTime } = aggregatedResults;
  const [runTime, setRunTime] = React.useState(0);
  const time = useCounter();
  React.useEffect(() => {
    let newRunTime = (Date.now() - startTime) / 1000;

    if (options && options.roundTime) {
      newRunTime = Math.floor(newRunTime);
    }

    setRunTime(newRunTime);
  }, [options, startTime, time]);

  const estimatedTime = (options && options.estimatedTime) || 0;
  const snapshotResults = aggregatedResults.snapshot;
  const snapshotsAdded = snapshotResults.added;
  const snapshotsFailed = snapshotResults.unmatched;
  const snapshotsOutdated = snapshotResults.unchecked;
  const snapshotsFilesRemoved = snapshotResults.filesRemoved;
  const snapshotsDidUpdate = snapshotResults.didUpdate;
  const snapshotsPassed = snapshotResults.matched;
  const snapshotsTotal = snapshotResults.total;
  const snapshotsUpdated = snapshotResults.updated;
  const suitesFailed = aggregatedResults.numFailedTestSuites;
  const suitesPassed = aggregatedResults.numPassedTestSuites;
  const suitesPending = aggregatedResults.numPendingTestSuites;
  const suitesRun = suitesFailed + suitesPassed;
  const suitesTotal = aggregatedResults.numTotalTestSuites;
  const testsFailed = aggregatedResults.numFailedTests;
  const testsPassed = aggregatedResults.numPassedTests;
  const testsPending = aggregatedResults.numPendingTests;
  const testsTodo = aggregatedResults.numTodoTests;
  const testsTotal = aggregatedResults.numTotalTests;
  const width = (options && options.width) || 0;

  return (
    <Box flexDirection="column">
      <Box>
        <SummaryHeading>Test Suites</SummaryHeading>
        <Box>
          {suitesFailed > 0 && (
            <>
              <Color bold red>
                {suitesFailed} failed
              </Color>
              ,{' '}
            </>
          )}
          {suitesPending > 0 && (
            <>
              <Color bold yellow>
                {suitesPending} skipped
              </Color>
              ,{' '}
            </>
          )}
          {suitesPassed > 0 && (
            <>
              <Color bold green>
                {suitesPassed} passed
              </Color>
              ,{' '}
            </>
          )}
          {suitesRun !== suitesTotal && `${suitesRun} of `}
          {suitesTotal} total
        </Box>
      </Box>
      <Box>
        <SummaryHeading>Tests</SummaryHeading>
        <Box>
          {testsFailed > 0 && (
            <>
              <Color bold red>
                {testsFailed} failed
              </Color>
              ,{' '}
            </>
          )}
          {testsPending > 0 && (
            <>
              <Color bold yellow>
                {testsPending} skipped
              </Color>
              ,{' '}
            </>
          )}
          {testsTodo > 0 && (
            <>
              <Color bold magenta>
                {testsTodo} todo
              </Color>
              ,{' '}
            </>
          )}
          {testsPassed > 0 && (
            <>
              <Color bold green>
                {testsPassed} passed
              </Color>
              ,{' '}
            </>
          )}
          {testsTotal} total
        </Box>
      </Box>
      <Box>
        <SummaryHeading>Snapshots</SummaryHeading>
        <Box>
          {snapshotsFailed > 0 && (
            <>
              <Color bold red>
                {snapshotsFailed} failed
              </Color>
              ,{' '}
            </>
          )}
          {snapshotsOutdated > 0 && !snapshotsDidUpdate && (
            <>
              <Color bold yellow>
                {snapshotsOutdated} obsolete
              </Color>
              ,{' '}
            </>
          )}
          {snapshotsOutdated > 0 && snapshotsDidUpdate && (
            <>
              <Color bold green>
                {snapshotsOutdated} removed
              </Color>
              ,{' '}
            </>
          )}
          {snapshotsFilesRemoved > 0 && !snapshotsDidUpdate && (
            <>
              <Color bold yellow>
                {pluralize('file', snapshotsFilesRemoved)} obsolete
              </Color>
              ,{' '}
            </>
          )}
          {snapshotsFilesRemoved > 0 && snapshotsDidUpdate && (
            <>
              <Color bold green>
                {pluralize('file', snapshotsFilesRemoved)} removed
              </Color>
              ,{' '}
            </>
          )}
          {snapshotsUpdated > 0 && (
            <>
              <Color bold green>
                {snapshotsUpdated} updated
              </Color>
              ,{' '}
            </>
          )}
          {snapshotsAdded > 0 && (
            <>
              <Color bold green>
                {snapshotsAdded} written
              </Color>
              ,{' '}
            </>
          )}
          {snapshotsPassed > 0 && (
            <>
              <Color bold green>
                {snapshotsPassed} passed
              </Color>
              ,{' '}
            </>
          )}
          {snapshotsTotal} total
        </Box>
      </Box>

      <Box>
        <SummaryHeading>Time</SummaryHeading>

        <Time runTime={runTime} done={done} estimatedTime={estimatedTime} />
      </Box>
      {done ? null : (
        <ProgressBar
          runTime={runTime}
          estimatedTime={estimatedTime}
          width={width}
        />
      )}
    </Box>
  );
};

const ProgressBar: React.FC<{
  runTime: number;
  estimatedTime: number;
  width?: number;
}> = ({ estimatedTime, runTime, width }) => {
  // Only show a progress bar if the test run is actually going to take
  // some time.
  if (estimatedTime <= 2 || runTime >= estimatedTime || !width) {
    return null;
  }
  const availableWidth = Math.min(PROGRESS_BAR_WIDTH, width);

  if (availableWidth < 2) {
    return null;
  }

  const length = Math.min(
    Math.floor((runTime / estimatedTime) * availableWidth),
    availableWidth,
  );

  return (
    <Box>
      <Color green>{'█'.repeat(length)}</Color>
      <Color white>{'█'.repeat(availableWidth - length)}</Color>
    </Box>
  );
};

const Time: React.FC<{
  runTime: number;
  estimatedTime: number;
  done: boolean;
}> = ({ runTime, estimatedTime, done }) => {
  // If we are more than one second over the estimated time, highlight it.
  const renderedTime =
    estimatedTime && runTime >= estimatedTime + 1 ? (
      <Color bold yellow>
        {runTime}s
      </Color>
    ) : (
      <Text>{runTime}s</Text>
    );

  return (
    <Box>
      {renderedTime}
      {!done && runTime < estimatedTime ? (
        <>, estimated {estimatedTime}s</>
      ) : null}
    </Box>
  );
};
