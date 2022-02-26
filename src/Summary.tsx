import type { SummaryOptions } from '@jest/reporters';
import type { AggregatedResult } from '@jest/test-result';
import { pluralize } from 'jest-util';
import * as React from 'react';
import { Box, Text } from 'ink';
import { useCounter } from './hooks';

const PROGRESS_BAR_WIDTH = 40;

const SummaryHeading: React.FC = ({ children }) => (
  <Box width={13}>
    <Text bold>{children}:</Text>
  </Box>
);

const RightPaddedWithComma: React.FC = ({ children }) => (
  <Box paddingRight={1}>
    <Text>{children},</Text>
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
            <Text>
              <Text bold color="red">
                {suitesFailed} failed
              </Text>
              ,{' '}
            </Text>
          )}
          {suitesPending > 0 && (
            <Text>
              <Text bold color="yellow">
                {suitesPending} skipped
              </Text>
              ,{' '}
            </Text>
          )}
          {suitesPassed > 0 && (
            <Text>
              <Text bold color="green">
                {suitesPassed} passed
              </Text>
              ,{' '}
            </Text>
          )}
          {suitesRun !== suitesTotal && <Text>{suitesRun} of </Text>}
          <Text>{suitesTotal} total</Text>
        </Box>
      </Box>
      <Box>
        <SummaryHeading>Tests</SummaryHeading>
        <Box>
          {testsFailed > 0 && (
            <RightPaddedWithComma>
              <Text bold color="red">
                {testsFailed} failed
              </Text>
            </RightPaddedWithComma>
          )}
          {testsPending > 0 && (
            <>
              <Text bold color="yellow">
                {testsPending} skipped
              </Text>
              ,{' '}
            </>
          )}
          {testsTodo > 0 && (
            <RightPaddedWithComma>
              <Text bold color="magenta">
                {testsTodo} todo
              </Text>
            </RightPaddedWithComma>
          )}
          {testsPassed > 0 && (
            <RightPaddedWithComma>
              <Text bold color="green">
                {testsPassed} passed
              </Text>
            </RightPaddedWithComma>
          )}
          <Text>{testsTotal} total</Text>
        </Box>
      </Box>
      <Box>
        <SummaryHeading>Snapshots</SummaryHeading>
        <Box>
          {snapshotsFailed > 0 && (
            <RightPaddedWithComma>
              <Text bold color="red">
                {snapshotsFailed} failed
              </Text>
            </RightPaddedWithComma>
          )}
          {snapshotsOutdated > 0 && !snapshotsDidUpdate && (
            <RightPaddedWithComma>
              <Text bold color="yellow">
                {snapshotsOutdated} obsolete
              </Text>
            </RightPaddedWithComma>
          )}
          {snapshotsOutdated > 0 && snapshotsDidUpdate && (
            <>
              <Text bold color="green">
                {snapshotsOutdated} removed
              </Text>
              ,{' '}
            </>
          )}
          {snapshotsFilesRemoved > 0 && !snapshotsDidUpdate && (
            <RightPaddedWithComma>
              <Text bold color="yellow">
                {pluralize('file', snapshotsFilesRemoved)} obsolete
              </Text>
            </RightPaddedWithComma>
          )}
          {snapshotsFilesRemoved > 0 && snapshotsDidUpdate && (
            <RightPaddedWithComma>
              <Text bold color="green">
                {pluralize('file', snapshotsFilesRemoved)} removed
              </Text>
            </RightPaddedWithComma>
          )}
          {snapshotsUpdated > 0 && (
            <RightPaddedWithComma>
              <Text bold color="green">
                {snapshotsUpdated} updated
              </Text>
            </RightPaddedWithComma>
          )}
          {snapshotsAdded > 0 && (
            <RightPaddedWithComma>
              <Text bold color="green">
                {snapshotsAdded} written
              </Text>
            </RightPaddedWithComma>
          )}
          {snapshotsPassed > 0 && (
            <RightPaddedWithComma>
              <Text bold color="green">
                {snapshotsPassed} passed
              </Text>
            </RightPaddedWithComma>
          )}
          <Text>{snapshotsTotal} total</Text>
        </Box>
      </Box>
      <Box>
        <SummaryHeading>Time</SummaryHeading>
        <Time runTime={runTime} estimatedTime={estimatedTime} />
      </Box>

      <ProgressBar
        done={done}
        runTime={runTime}
        estimatedTime={estimatedTime}
        width={width}
      />
    </Box>
  );
};

const ProgressBar: React.FC<{
  runTime: number;
  estimatedTime: number;
  done: boolean;
  width?: number;
}> = ({ estimatedTime, runTime, width, done }) => {
  if (done) {
    return null;
  }
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
      <Text color="green">{'█'.repeat(length)}</Text>
      <Text color="white">{'█'.repeat(availableWidth - length)}</Text>
    </Box>
  );
};

const Time: React.FC<{
  runTime: number;
  estimatedTime: number;
}> = ({ runTime, estimatedTime }) => {
  // If we are more than one second over the estimated time, highlight it.
  const renderedTime =
    estimatedTime && runTime >= estimatedTime + 1 ? (
      <Text bold color="yellow">
        {runTime}s
      </Text>
    ) : (
      <Text>{runTime}s</Text>
    );

  return (
    <Box>
      {renderedTime}
      {runTime < estimatedTime ? (
        <Text>, estimated {estimatedTime}s</Text>
      ) : null}
    </Box>
  );
};
