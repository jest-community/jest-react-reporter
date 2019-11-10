import * as path from 'path';
import execa from 'execa';

async function runJest() {
  return execa('jest', [], {
    all: true,
    cwd: path.resolve(__dirname, '../pass'),
    preferLocal: true,
    localDir: path.resolve(__dirname, '../../'),
  });
}

test('handles passing test', async () => {
  const { all } = await runJest();

  console.log(all);

  expect(all).toMatchSnapshot();
});
