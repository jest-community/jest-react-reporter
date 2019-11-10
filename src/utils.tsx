import * as path from 'path';
import { Config } from '@jest/types';
import slash from 'slash';
import * as React from 'react';
import { Color } from 'ink';
import { PaddedColor } from './shared';

export const DisplayName: React.FC<{
  config: Config.ProjectConfig;
}> = ({ config }) => {
  const { displayName } = config;
  if (!displayName) {
    return null;
  }

  if (typeof displayName === 'string') {
    return (
      <PaddedColor white inverse reset>
        {displayName}
      </PaddedColor>
    );
  }

  const { name, color } = displayName;

  return (
    <PaddedColor {...{ [color]: true }} inverse reset>
      {name}
    </PaddedColor>
  );
};

export const FormattedPath = ({
  pad,
  config,
  testPath,
  columns,
}: {
  pad: number;
  config: Config.ProjectConfig | Config.GlobalConfig;
  testPath: Config.Path;
  columns?: number;
}) => {
  const maxLength = (columns || 0) - pad;
  const relative = relativePath(config, testPath);
  const { basename } = relative;
  let { dirname } = relative;
  dirname = slash(dirname);

  // length is ok
  if (`${dirname}/${basename}`.length <= maxLength) {
    return (
      <>
        <Color dim>{dirname}/</Color>
        <Color bold>{basename}</Color>
      </>
    );
  }

  // we can fit trimmed dirname and full basename
  const basenameLength = basename.length;
  if (basenameLength + 4 < maxLength) {
    const dirnameLength = maxLength - 4 - basenameLength;
    dirname = `…${dirname.slice(
      dirname.length - dirnameLength,
      dirname.length,
    )}`;
    return (
      <>
        <Color dim>{dirname}/</Color>
        <Color bold>{basename}</Color>
      </>
    );
  }

  if (basenameLength + 4 === maxLength) {
    return (
      <>
        <Color dim>…/</Color>
        <Color bold>{basename}</Color>
      </>
    );
  }

  // can't fit dirname, but can fit trimmed basename
  return (
    <Color bold>
      …{basename.slice(basename.length - maxLength - 4, basename.length)}
    </Color>
  );
};

export const FormatFullTestPath: React.FC<{
  config: Config.GlobalConfig | Config.ProjectConfig;
  testPath: Config.Path;
}> = ({ config, testPath }) => (
  <FormattedPath config={config} testPath={testPath} pad={0} />
);

const relativePath = (
  config: Config.GlobalConfig | Config.ProjectConfig,
  testPath: Config.Path,
) => {
  // this function can be called with ProjectConfigs or GlobalConfigs. GlobalConfigs
  // do not have config.cwd, only config.rootDir. Try using config.cwd, fallback
  // to config.rootDir. (Also, some unit just use config.rootDir, which is ok)
  testPath = path.relative(
    (config as Config.ProjectConfig).cwd || config.rootDir,
    testPath,
  );
  const dirname = path.dirname(testPath);
  const basename = path.basename(testPath);
  return { basename, dirname };
};

// from: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => void, delay: number) {
  const savedCallback = React.useRef(callback);

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return undefined;
  }, [delay]);
}

export function useCounter() {
  const [count, setCount] = React.useState(0);

  useInterval(() => {
    setCount(count => count + 1);
  }, 1000);

  return count;
}
