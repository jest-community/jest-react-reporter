import type { TestResult } from '@jest/test-result';

import * as React from 'react';
import { Box, Text } from 'ink';

import { pluralize } from 'jest-util';
import { Arrow, Dot } from './shared';

const FailText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text bold color="red">
    {children}
  </Text>
);
const SnapshotAdded: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Text bold color="green">
    {children}
  </Text>
);
const SnapshotUpdated: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Text bold color="green">
    {children}
  </Text>
);
const SnapshotOutdated: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Text bold color="yellow">
    {children}
  </Text>
);

export const SnapshotStatus: React.FC<{
  snapshot: TestResult['snapshot'];
  afterUpdate: boolean;
}> = ({ snapshot, afterUpdate }) => (
  <>
    {snapshot.added > 0 && (
      <SnapshotAdded>
        <Arrow /> {pluralize('snapshot', snapshot.added)} written.
      </SnapshotAdded>
    )}
    {snapshot.updated > 0 && (
      <SnapshotUpdated>
        <Arrow /> {pluralize('snapshot', snapshot.updated)} updated.
      </SnapshotUpdated>
    )}
    {snapshot.unmatched > 0 && (
      <FailText>
        <Arrow /> {pluralize('snapshot', snapshot.unmatched)} failed.
      </FailText>
    )}
    {snapshot.unchecked > 0 ? (
      afterUpdate ? (
        <SnapshotUpdated>
          <Arrow /> {pluralize('snapshot', snapshot.unchecked)} removed.
        </SnapshotUpdated>
      ) : (
        <SnapshotOutdated>
          <Arrow /> {pluralize('snapshot', snapshot.unchecked)} obsolete.
        </SnapshotOutdated>
      )
    ) : null}
    {snapshot.unchecked > 0 &&
      snapshot.uncheckedKeys.map(key => (
        <Box key={key}>
          &nbsp;&nbsp;
          <Dot />
          {key}
        </Box>
      ))}
    {snapshot.fileDeleted && (
      <SnapshotUpdated>
        <Arrow /> snapshot file removed.
      </SnapshotUpdated>
    )}
  </>
);
