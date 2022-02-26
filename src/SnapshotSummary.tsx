import * as React from 'react';
import { Box, Text } from 'ink';
import type { Config } from '@jest/types';
import { pluralize } from 'jest-util';
import type { SnapshotSummary as SnapshotSummaryType } from '@jest/test-result';
import { Arrow, Dot, DownArrow, FormatFullTestPath } from './shared';

const SnapshotSummary: React.FC<{
  snapshots: SnapshotSummaryType;
  globalConfig: Config.GlobalConfig;
  updateCommand: string;
}> = ({ snapshots, globalConfig, updateCommand }) => (
  <Box flexDirection="column">
    <Text bold>Snapshot Summary</Text>
    {snapshots.added && (
      <Box>
        <Text bold color="green">
          <Arrow />
          {pluralize('snapshot', snapshots.added)} written
        </Text>{' '}
        from {pluralize('test suite', snapshots.filesAdded)}.
      </Box>
    )}
    {snapshots.unmatched && (
      <Box>
        <Text bold color="red">
          <Arrow />
          {pluralize('snapshot', snapshots.unmatched)} failed
        </Text>{' '}
        from {pluralize('test suite', snapshots.filesUnmatched)}.{' '}
        <Text dimColor>
          Inspect your code changes or {updateCommand} to update them.
        </Text>
      </Box>
    )}
    {snapshots.updated && (
      <Box>
        <Text bold color="green">
          <Arrow />
          {pluralize('snapshot', snapshots.updated)} updated
        </Text>{' '}
        from {pluralize('test suite', snapshots.filesUpdated)}.
      </Box>
    )}
    {snapshots.filesRemoved &&
      (snapshots.didUpdate ? (
        <Box>
          <Text bold color="green">
            <Arrow />
            {pluralize('snapshot file', snapshots.filesRemoved)} removed
          </Text>{' '}
          from {pluralize('test suite', snapshots.filesRemoved)}.
        </Box>
      ) : (
        <Box>
          <Text bold color="yellow">
            <Arrow />
            {pluralize('snapshot file', snapshots.filesRemoved)} obsolete
          </Text>{' '}
          from {pluralize('test suite', snapshots.filesRemoved)}.{' '}
          <Text dimColor>
            To remove ${snapshots.filesRemoved === 1 ? 'it' : 'them all'},{' '}
            {updateCommand}.
          </Text>
        </Box>
      ))}
    {snapshots.unchecked &&
      (snapshots.didUpdate ? (
        <Box>
          <Text bold color="green">
            <Arrow />
            {pluralize('snapshot', snapshots.unchecked)} removed
          </Text>{' '}
          from {pluralize('test suite', snapshots.uncheckedKeysByFile.length)}.
        </Box>
      ) : (
        <Box>
          <Text bold color="yellow">
            <Arrow />
            {pluralize('snapshot', snapshots.unchecked)} obsolete
          </Text>{' '}
          from {pluralize('test suite', snapshots.uncheckedKeysByFile.length)}.{' '}
          <Text dimColor>
            To remove ${snapshots.unchecked === 1 ? 'it' : 'them all'},{' '}
            {updateCommand}.
          </Text>
        </Box>
      ))}
    {snapshots.unchecked &&
      snapshots.uncheckedKeysByFile.map(uncheckedFile => (
        <>
          <Box>
            &nbsp;&nbsp;
            <DownArrow />
            <FormatFullTestPath
              config={globalConfig}
              testPath={uncheckedFile.filePath}
            />
          </Box>
          <Box>
            {uncheckedFile.keys.map(key => (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Dot />
                {key}
              </>
            ))}
          </Box>
        </>
      ))}
  </Box>
);

export default SnapshotSummary;
