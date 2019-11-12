import * as React from 'react';
import { Box, Color, Text } from 'ink';
import { Config } from '@jest/types';
import { pluralize } from 'jest-util';
import { SnapshotSummary as SnapshotSummaryType } from '@jest/test-result';
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
        <Color bold green>
          <Arrow />
          {pluralize('snapshot', snapshots.added)} written
        </Color>{' '}
        from {pluralize('test suite', snapshots.filesAdded)}.
      </Box>
    )}
    {snapshots.unmatched && (
      <Box>
        <Color bold red>
          <Arrow />
          {pluralize('snapshot', snapshots.unmatched)} failed
        </Color>{' '}
        from {pluralize('test suite', snapshots.filesUnmatched)}.{' '}
        <Color dim>
          Inspect your code changes or {updateCommand} to update them.
        </Color>
      </Box>
    )}
    {snapshots.updated && (
      <Box>
        <Color bold green>
          <Arrow />
          {pluralize('snapshot', snapshots.updated)} updated
        </Color>{' '}
        from {pluralize('test suite', snapshots.filesUpdated)}.
      </Box>
    )}
    {snapshots.filesRemoved &&
      (snapshots.didUpdate ? (
        <Box>
          <Color bold green>
            <Arrow />
            {pluralize('snapshot file', snapshots.filesRemoved)} removed
          </Color>{' '}
          from {pluralize('test suite', snapshots.filesRemoved)}.
        </Box>
      ) : (
        <Box>
          <Color bold yellow>
            <Arrow />
            {pluralize('snapshot file', snapshots.filesRemoved)} obsolete
          </Color>{' '}
          from {pluralize('test suite', snapshots.filesRemoved)}.{' '}
          <Color dim>
            To remove ${snapshots.filesRemoved === 1 ? 'it' : 'them all'},{' '}
            {updateCommand}.
          </Color>
        </Box>
      ))}
    {snapshots.unchecked &&
      (snapshots.didUpdate ? (
        <Box>
          <Color bold green>
            <Arrow />
            {pluralize('snapshot', snapshots.unchecked)} removed
          </Color>{' '}
          from {pluralize('test suite', snapshots.uncheckedKeysByFile.length)}.
        </Box>
      ) : (
        <Box>
          <Color bold yellow>
            <Arrow />
            {pluralize('snapshot', snapshots.unchecked)} obsolete
          </Color>{' '}
          from {pluralize('test suite', snapshots.uncheckedKeysByFile.length)}.{' '}
          <Color dim>
            To remove ${snapshots.unchecked === 1 ? 'it' : 'them all'},{' '}
            {updateCommand}.
          </Color>
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
