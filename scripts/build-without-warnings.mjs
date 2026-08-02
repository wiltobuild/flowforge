import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const build = spawn(isWindows ? 'npm.cmd run build' : 'npm', isWindows ? [] : ['run', 'build'], {
  shell: isWindows,
  stdio: ['inherit', 'pipe', 'pipe'],
});
let output = '';

for (const stream of [build.stdout, build.stderr]) {
  stream.on('data', (chunk) => {
    const text = chunk.toString();
    output += text;
    process[stream === build.stdout ? 'stdout' : 'stderr'].write(text);
  });
}

const exitCode = await new Promise((resolve, reject) => {
  build.once('error', reject);
  build.once('close', resolve);
});

if (exitCode !== 0) process.exit(exitCode ?? 1);

const warningLines = output
  .split(/\r?\n/)
  .filter(
    (line) =>
      !/\b0 warnings?\b/i.test(line) &&
      /(?:\bwarning\b|\bwarn\b|\[warn\])/i.test(line),
  );

if (warningLines.length > 0) {
  console.error('\nBuild emitted warning diagnostics; zero-warning builds are required.');
  process.exitCode = 1;
}
